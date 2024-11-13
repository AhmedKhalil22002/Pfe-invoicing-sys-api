import { Injectable, StreamableFile } from '@nestjs/common';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { FirmService } from 'src/modules/firm/services/firm.service';
import { InterlocutorService } from 'src/modules/interlocutor/services/interlocutor.service';
import { InvoicingCalculationsService } from 'src/common/calculations/services/invoicing.calculations.service';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions, UpdateResult } from 'typeorm';
import { PdfService } from 'src/common/pdf/services/pdf.service';
import { format } from 'date-fns';
import { QueryBuilder } from 'src/common/database/utils/database-query-builder';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { BankAccountService } from 'src/modules/bank-account/services/bank-account.service';
import { Transactional } from '@nestjs-cls/transactional';
import { InvoiceRepository } from '../repositories/repository/invoice.repository';
import { ArticleInvoiceEntryService } from './article-invoice-entry.service';
import { InvoiceUploadService } from './invoice-upload.service';
import { InvoiceMetaDataService } from './invoice-meta-data.service';
import { InvoiceSequenceService } from './invoice-sequence.service';
import { InvoiceNotFoundException } from '../errors/invoice.notfound.error';
import { InvoiceEntity } from '../repositories/entities/invoice.entity';
import { ResponseInvoiceDto } from '../dtos/invoice.response.dto';
import { CreateInvoiceDto } from '../dtos/invoice.create.dto';
import { UpdateInvoiceDto } from '../dtos/invoice.update.dto';
import { ResponseInvoiceUploadDto } from '../dtos/invoice-upload.response.dto';
import { ArticleInvoiceEntryEntity } from '../repositories/entities/article-invoice-entry.entity';
import { DuplicateInvoiceDto } from '../dtos/invoice.duplicate.dto';
import { INVOICE_STATUS } from '../enums/invoice-status.enum';
import { UpdateInvoiceSequenceDto } from '../dtos/invoice-seqence.update.dto';
import { InvoiceSequence } from '../interfaces/invoice-sequence.interface';
import { QuotationEntity } from 'src/modules/quotation/repositories/entities/quotation.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class InvoiceService {
  constructor(
    //repositories
    private readonly invoiceRepository: InvoiceRepository,
    //entity services
    private readonly articleInvoiceEntryService: ArticleInvoiceEntryService,
    private readonly invoiceUploadService: InvoiceUploadService,
    private readonly bankAccountService: BankAccountService,
    private readonly currencyService: CurrencyService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
    private readonly invoiceSequenceService: InvoiceSequenceService,
    private readonly invoiceMetaDataService: InvoiceMetaDataService,
    private readonly taxService: TaxService,

    //abstract services
    private readonly calculationsService: InvoicingCalculationsService,
    private readonly pdfService: PdfService,
  ) {}

  async downloadPdf(id: number, template: string): Promise<StreamableFile> {
    const invoice = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: new String().concat(
        'firm,',
        'cabinet,',
        'currency,',
        'bankAccount,',
        'interlocutor,',
        'cabinet.address,',
        'invoiceMetaData,',
        'firm.deliveryAddress,',
        'firm.invoicingAddress,',
        'articleInvoiceEntries,',
        'articleInvoiceEntries.article,',
        'articleInvoiceEntries.articleInvoiceEntryTaxes,',
        'articleInvoiceEntries.articleInvoiceEntryTaxes.tax',
      ),
    });
    const digitsAferComma = invoice.currency.digitAfterComma;
    if (invoice) {
      const data = {
        meta: {
          ...invoice.invoiceMetaData,
          type: 'DEVIS',
        },
        invoice: {
          ...invoice,
          date: format(invoice.date, 'dd/MM/yyyy'),
          dueDate: format(invoice.dueDate, 'dd/MM/yyyy'),
          taxSummary: invoice.invoiceMetaData.taxSummary,
          subTotal: invoice.subTotal.toFixed(digitsAferComma),
          total: invoice.total.toFixed(digitsAferComma),
        },
      };

      const pdfBuffer = await this.pdfService.generatePdf(data, template);
      return new StreamableFile(pdfBuffer);
    } else {
      throw new InvoiceNotFoundException();
    }
  }

  async findOneById(id: number): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findOneById(id);
    if (!invoice) {
      throw new InvoiceNotFoundException();
    }
    return invoice;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<ResponseInvoiceDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const invoice = await this.invoiceRepository.findByCondition(
      queryOptions as FindOneOptions<InvoiceEntity>,
    );
    if (!invoice) return null;
    return invoice;
  }

  async findAll(query: IQueryObject = {}): Promise<InvoiceEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.invoiceRepository.findAll(
      queryOptions as FindManyOptions<InvoiceEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponseInvoiceDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.invoiceRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.invoiceRepository.findAll(
      queryOptions as FindManyOptions<InvoiceEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: parseInt(query.page),
        take: parseInt(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceEntity> {
    // Parallelize fetching firm, bank account, and currency, as they are independent
    const [firm, bankAccount, currency] = await Promise.all([
      this.firmService.findOneByCondition({
        filter: `id||$eq||${createInvoiceDto.firmId}`,
      }),
      createInvoiceDto.bankAccountId
        ? this.bankAccountService.findOneById(createInvoiceDto.bankAccountId)
        : Promise.resolve(null),
      createInvoiceDto.currencyId
        ? this.currencyService.findOneById(createInvoiceDto.currencyId)
        : Promise.resolve(null),
    ]);

    if (!firm) {
      throw new Error('Firm not found');
    }

    // Check interlocutor existence
    await this.interlocutorService.findOneById(createInvoiceDto.interlocutorId);

    // Save article entries if provided
    const articleEntries =
      createInvoiceDto.articleInvoiceEntries &&
      (await this.articleInvoiceEntryService.saveMany(
        createInvoiceDto.articleInvoiceEntries,
      ));

    if (!articleEntries) {
      throw new Error('Article entries are missing');
    }

    // Calculate financial information
    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    // Fetch tax stamp if provided
    const taxStamp = createInvoiceDto.taxStampId
      ? await this.taxService.findOneById(createInvoiceDto.taxStampId)
      : null;

    // Apply general discount
    const totalAfterGeneralDiscount =
      this.calculationsService.calculateTotalDiscount(
        total,
        createInvoiceDto.discount,
        createInvoiceDto.discount_type,
        taxStamp?.value || 0,
      );

    // Format articleEntries as lineItems for tax calculations
    const lineItems = await this.articleInvoiceEntryService.findManyAsLineItem(
      articleEntries.map((entry) => entry.id),
    );

    // Calculate tax summary and fetch tax details in parallel
    const taxSummary = await Promise.all(
      this.calculationsService
        .calculateTaxSummary(lineItems)
        .map(async (item) => {
          const tax = await this.taxService.findOneById(item.taxId);

          return {
            ...item,
            label: tax.label,
            // If the tax is a rate (percentage), multiply by 100 for percentage display,
            // otherwise use the fixed amount directly.
            value: tax.isRate ? tax.value * 100 : tax.value,
            isRate: tax.isRate, // You can also return this flag for further use.
          };
        }),
    );

    // Fetch the latest sequential number for invoice
    const sequential = await this.invoiceSequenceService.getSequential();

    // Save invoice metadata
    const invoiceMetaData = await this.invoiceMetaDataService.save({
      ...createInvoiceDto.invoiceMetaData,
      taxSummary,
    });

    // Save the invoice entity
    const invoice = await this.invoiceRepository.save({
      ...createInvoiceDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      //this will be changed to fit with the connected cabinet
      cabinetId: 1,
      sequential,
      articleInvoiceEntries: articleEntries,
      invoiceMetaData,
      subTotal,
      total: totalAfterGeneralDiscount,
    });

    // Handle file uploads if they exist
    if (createInvoiceDto.uploads) {
      await Promise.all(
        createInvoiceDto.uploads.map((u) =>
          this.invoiceUploadService.save(invoice.id, u.uploadId),
        ),
      );
    }

    return invoice;
  }

  async saveMany(
    createInvoiceDtos: CreateInvoiceDto[],
  ): Promise<InvoiceEntity[]> {
    const invoices = [];
    for (const createInvoiceDto of createInvoiceDtos) {
      const invoice = await this.save(createInvoiceDto);
      invoices.push(invoice);
    }
    return invoices;
  }

  @Transactional()
  async saveFromQuotation(quotation: QuotationEntity): Promise<InvoiceEntity> {
    return this.save({
      quotationId: quotation.id,
      currencyId: quotation.currencyId,
      bankAccountId: quotation.bankAccountId,
      interlocutorId: quotation.interlocutorId,
      firmId: quotation.firmId,
      discount: quotation.discount,
      discount_type: quotation.discount_type,
      object: quotation.object,
      status: INVOICE_STATUS.Draft,
      date: new Date(),
      dueDate: null,
      articleInvoiceEntries: quotation.articleQuotationEntries.map((entry) => {
        return {
          unit_price: entry.unit_price,
          quantity: entry.quantity,
          discount: entry.discount,
          discount_type: entry.discount_type,
          subTotal: entry.subTotal,
          total: entry.total,
          articleId: entry.article.id,
          article: entry.article,
          taxes: entry.articleQuotationEntryTaxes.map((entry) => {
            return entry.taxId;
          }),
        };
      }),
    });
  }

  async updateInvoiceUploads(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
    existingUploads: ResponseInvoiceUploadDto[],
  ) {
    const newUploads = [];
    const keptUploads = [];
    const eliminatedUploads = [];

    if (updateInvoiceDto.uploads) {
      for (const upload of existingUploads) {
        const exists = updateInvoiceDto.uploads.some((u) => u.id === upload.id);
        if (!exists)
          eliminatedUploads.push(
            await this.invoiceUploadService.softDelete(upload.id),
          );
        else keptUploads.push(upload);
      }
      for (const upload of updateInvoiceDto.uploads) {
        if (!upload.id)
          newUploads.push(
            await this.invoiceUploadService.save(id, upload.uploadId),
          );
      }
    }
    return {
      keptUploads,
      newUploads,
      eliminatedUploads,
    };
  }

  @Transactional()
  async update(
    id: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceEntity> {
    // Retrieve the existing invoice with necessary relations
    const { uploads: existingUploads, ...existingInvoice } =
      await this.findOneByCondition({
        filter: `id||$eq||${id}`,
        join: 'articleInvoiceEntries,invoiceMetaData,uploads',
      });

    // Fetch and validate related entities
    const [firm, bankAccount, currency, interlocutor] = await Promise.all([
      this.firmService.findOneByCondition({
        filter: `id||$eq||${updateInvoiceDto.firmId}`,
      }),
      updateInvoiceDto.bankAccountId
        ? this.bankAccountService.findOneById(updateInvoiceDto.bankAccountId)
        : null,
      updateInvoiceDto.currencyId
        ? this.currencyService.findOneById(updateInvoiceDto.currencyId)
        : null,
      updateInvoiceDto.interlocutorId
        ? this.interlocutorService.findOneById(updateInvoiceDto.interlocutorId)
        : null,
    ]);

    // Soft delete old article entries to prepare for new ones
    const existingArticles =
      await this.articleInvoiceEntryService.softDeleteMany(
        existingInvoice.articleInvoiceEntries.map((entry) => entry.id),
      );

    // Save new article entries
    const articleEntries: ArticleInvoiceEntryEntity[] =
      updateInvoiceDto.articleInvoiceEntries
        ? await this.articleInvoiceEntryService.saveMany(
            updateInvoiceDto.articleInvoiceEntries,
          )
        : existingArticles;

    // Calculate the subtotal and total for the new entries
    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    // Fetch tax stamp if provided
    const taxStamp = updateInvoiceDto.taxStampId
      ? await this.taxService.findOneById(updateInvoiceDto.taxStampId)
      : null;

    // Apply general discount
    const totalAfterGeneralDiscount =
      this.calculationsService.calculateTotalDiscount(
        total,
        updateInvoiceDto.discount,
        updateInvoiceDto.discount_type,
        taxStamp?.value || 0,
      );

    // Convert article entries to line items for further calculations
    const lineItems = await this.articleInvoiceEntryService.findManyAsLineItem(
      articleEntries.map((entry) => entry.id),
    );

    // Calculate tax summary (handle both percentage and fixed taxes)
    const taxSummary = await Promise.all(
      this.calculationsService
        .calculateTaxSummary(lineItems)
        .map(async (item) => {
          const tax = await this.taxService.findOneById(item.taxId);

          return {
            ...item,
            label: tax.label,
            // Check if the tax is rate-based or a fixed amount
            rate: tax.isRate ? tax.value * 100 : tax.value, // handle both types
            isRate: tax.isRate,
          };
        }),
    );

    // Save or update the invoice metadata with the updated tax summary
    const invoiceMetaData = await this.invoiceMetaDataService.save({
      ...existingInvoice.invoiceMetaData,
      ...updateInvoiceDto.invoiceMetaData,
      taxSummary,
    });

    // Handle uploads - manage existing, new, and eliminated uploads
    const { keptUploads, newUploads, eliminatedUploads } =
      await this.updateInvoiceUploads(
        existingInvoice.id,
        updateInvoiceDto,
        existingUploads,
      );

    // Save and return the updated invoice with all updated details
    return this.invoiceRepository.save({
      ...updateInvoiceDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      interlocutorId: interlocutor ? interlocutor.id : null,
      articleInvoiceEntries: articleEntries,
      invoiceMetaData,
      taxStampId: taxStamp ? taxStamp.id : null,
      subTotal,
      total: totalAfterGeneralDiscount,
      uploads: [...keptUploads, ...newUploads, ...eliminatedUploads],
    });
  }

  async updateFields(
    id: number,
    dict: QueryDeepPartialEntity<InvoiceEntity>,
  ): Promise<UpdateResult> {
    return this.invoiceRepository.update(id, dict);
  }

  async duplicate(
    duplicateInvoiceDto: DuplicateInvoiceDto,
  ): Promise<ResponseInvoiceDto> {
    const existingInvoice = await this.findOneByCondition({
      filter: `id||$eq||${duplicateInvoiceDto.id}`,
      join: new String().concat(
        'invoiceMetaData,',
        'articleInvoiceEntries,',
        'articleInvoiceEntries.articleInvoiceEntryTaxes,',
        'uploads',
      ),
    });
    const invoiceMetaData = await this.invoiceMetaDataService.duplicate(
      existingInvoice.invoiceMetaData.id,
    );
    const sequential = await this.invoiceSequenceService.getSequential();
    const invoice = await this.invoiceRepository.save({
      ...existingInvoice,
      id: undefined,
      sequential,
      invoiceMetaData,
      articleInvoiceEntries: [],
      uploads: [],
      amountPaid: 0,
      status: INVOICE_STATUS.Draft,
    });

    const articleInvoiceEntries =
      await this.articleInvoiceEntryService.duplicateMany(
        existingInvoice.articleInvoiceEntries.map((entry) => entry.id),
        invoice.id,
      );

    const uploads = duplicateInvoiceDto.includeFiles
      ? await this.invoiceUploadService.duplicateMany(
          existingInvoice.uploads.map((upload) => upload.id),
          invoice.id,
        )
      : [];

    return this.invoiceRepository.save({
      ...invoice,
      articleInvoiceEntries,
      uploads,
    });
  }

  async updateMany(
    updateInvoiceDtos: UpdateInvoiceDto[],
  ): Promise<InvoiceEntity[]> {
    return this.invoiceRepository.updateMany(updateInvoiceDtos);
  }

  async updateInvoiceSequence(
    updatedSequenceDto: UpdateInvoiceSequenceDto,
  ): Promise<InvoiceSequence> {
    return (await this.invoiceSequenceService.set(updatedSequenceDto)).value;
  }

  async softDelete(id: number): Promise<InvoiceEntity> {
    await this.findOneById(id);
    return this.invoiceRepository.softDelete(id);
  }

  async deleteAll() {
    return this.invoiceRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.invoiceRepository.getTotalCount();
  }
}
