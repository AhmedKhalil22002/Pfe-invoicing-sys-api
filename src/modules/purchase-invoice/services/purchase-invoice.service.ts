import { Injectable, StreamableFile } from '@nestjs/common';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { FirmService } from 'src/modules/firm/services/firm.service';
import { InterlocutorService } from 'src/modules/interlocutor/services/interlocutor.service';
import { InvoicingCalculationsService } from 'src/shared/calculations/services/invoicing.calculations.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PdfService } from 'src/shared/pdf/services/pdf.service';
import { format } from 'date-fns';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { BankAccountService } from 'src/modules/bank-account/services/bank-account.service';
import { Transactional } from '@nestjs-cls/transactional';
import { PurchaseInvoiceRepository } from '../repositories/purchase-invoice.repository';
import { ArticlePurchaseInvoiceEntryService } from './article-purchase-invoice-entry.service';
import { PurchaseInvoiceStorageService } from './purchase-invoice-upload.service';
import { PurchaseInvoiceMetaDataService } from './purchase-invoice-meta-data.service';
import { PurchaseInvoiceSequenceService } from './purchase-invoice-sequence.service';
import { PurchaseInvoiceNotFoundException } from '../errors/purchase-invoice.notfound.error';
import { PurchaseInvoiceEntity } from '../entities/purchase-invoice.entity';
import { ResponsePurchaseInvoiceDto } from '../dtos/purchase-invoice.response.dto';
import { CreatePurchaseInvoiceDto } from '../dtos/purchase-invoice.create.dto';
import { UpdatePurchaseInvoiceDto } from '../dtos/purchase-invoice.update.dto';
import { ArticlePurchaseInvoiceEntryEntity } from '../entities/article-purchase-invoice-entry.entity';
import { PURCHASE_INVOICE_STATUS } from '../enums/purchase-invoice-status.enum';
import { UpdatePurchaseInvoiceSequenceDto } from '../dtos/purchase-invoice-seqence.update.dto';
import { PurchaseInvoiceSequence } from '../interfaces/purchase-invoice-sequence.interface';
import { PurchaseQuotationEntity } from 'src/modules/purchase-quotation/entities/purchase-quotation.entity';
import { TaxWithholdingService } from 'src/modules/tax-withholding/services/tax-withholding.service';
import { ciel } from 'src/utils/number.utils';
import { parseSequential } from 'src/modules/sequence/utils/sequence.utils';
import { ResponsePurchaseInvoiceRangeDto } from '../dtos/purchase-invoice-range.response.dto';
import { PurchaseInvoiceStorageEntity } from '../entities/purchase-invoice-file.entity';
import { SequenceEntity } from 'src/modules/sequence/entities/sequence.entity';

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    private readonly purchaseInvoiceRepository: PurchaseInvoiceRepository,
    private readonly articlePurchaseInvoiceEntryService: ArticlePurchaseInvoiceEntryService,
    private readonly purchaseInvoiceStorageService: PurchaseInvoiceStorageService,
    private readonly bankAccountService: BankAccountService,
    private readonly currencyService: CurrencyService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
    private readonly purchaseInvoiceSequenceService: PurchaseInvoiceSequenceService,
    private readonly purchaseInvoiceMetaDataService: PurchaseInvoiceMetaDataService,
    private readonly taxService: TaxService,
    private readonly taxWithholdingService: TaxWithholdingService,
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
        'purchaseInvoiceMetaData,',
        'firm.deliveryAddress,',
        'firm.invoicingAddress,',
        'articlePurchaseInvoiceEntries,',
        'articlePurchaseInvoiceEntries.article,',
        'articlePurchaseInvoiceEntries.articlePurchaseInvoiceEntryTaxes,',
        'articlePurchaseInvoiceEntries.articlePurchaseInvoiceEntryTaxes.tax',
      ),
    });
    const digitsAferComma = invoice.currency.digitAfterComma;
    if (invoice) {
      const data = {
        meta: { ...invoice.purchaseInvoiceMetaData, type: 'FACTURE_ACHAT' },
        invoice: {
          ...invoice,
          date: format(invoice.date, 'dd/MM/yyyy'),
          dueDate: format(invoice.dueDate, 'dd/MM/yyyy'),
          taxSummary: invoice.purchaseInvoiceMetaData.taxSummary,
          subTotal: invoice.subTotal.toFixed(digitsAferComma),
          total: invoice.total.toFixed(digitsAferComma),
        },
      };

      const pdfBuffer = await this.pdfService.generatePdf(data, template);
      return new StreamableFile(new Uint8Array(pdfBuffer));
    } else {
      throw new PurchaseInvoiceNotFoundException();
    }
  }

  async findOneById(id: number): Promise<PurchaseInvoiceEntity> {
    const invoice = await this.purchaseInvoiceRepository.findOneById(id);
    if (!invoice) {
      throw new PurchaseInvoiceNotFoundException();
    }
    return invoice;
  }

  async findOneByCondition(
    query: IQueryObject = {},
  ): Promise<PurchaseInvoiceEntity | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const invoice = await this.purchaseInvoiceRepository.findOne(
      queryOptions as FindOneOptions<PurchaseInvoiceEntity>,
    );
    if (!invoice) return null;
    return invoice;
  }

  async findAll(query: IQueryObject = {}): Promise<PurchaseInvoiceEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.purchaseInvoiceRepository.findAll(
      queryOptions as FindManyOptions<PurchaseInvoiceEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponsePurchaseInvoiceDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.purchaseInvoiceRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.purchaseInvoiceRepository.findAll(
      queryOptions as FindManyOptions<PurchaseInvoiceEntity>,
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

  async findInvoicesByRange(id: number): Promise<ResponsePurchaseInvoiceRangeDto> {
    const currentSequential = await this.purchaseInvoiceSequenceService.get();
    const lastSequence = currentSequential.next - 1;

    const invoice = await this.findOneById(id);
    const { next } = parseSequential(invoice.sequential);

    const previousInvoice =
      next != 1
        ? await this.findOneByCondition({
            filter: `sequential||$ends||${next - 1}`,
          })
        : null;

    const nextInvoice =
      next != lastSequence
        ? await this.findOneByCondition({
            filter: `sequential||$ends||${next + 1}`,
          })
        : null;

    return { next: nextInvoice, previous: previousInvoice };
  }

  @Transactional()
  async save(createPurchaseInvoiceDto: CreatePurchaseInvoiceDto): Promise<PurchaseInvoiceEntity> {
    const [firm, bankAccount, currency] = await Promise.all([
      this.firmService.findOneByCondition({
        filter: `id||$eq||${createPurchaseInvoiceDto.firmId}`,
      }),
      createPurchaseInvoiceDto.bankAccountId
        ? this.bankAccountService.findOneById(createPurchaseInvoiceDto.bankAccountId)
        : Promise.resolve(null),
      createPurchaseInvoiceDto.currencyId
        ? this.currencyService.findOneById(createPurchaseInvoiceDto.currencyId)
        : Promise.resolve(null),
    ]);

    if (!firm) {
      throw new Error('Firm not found');
    }

    await this.interlocutorService.findOneById(createPurchaseInvoiceDto.interlocutorId);

    const articleEntries =
      createPurchaseInvoiceDto.articlePurchaseInvoiceEntries &&
      (await this.articlePurchaseInvoiceEntryService.saveMany(
        createPurchaseInvoiceDto.articlePurchaseInvoiceEntries,
      ));

    if (!articleEntries) {
      throw new Error('Article entries are missing');
    }

    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    const taxStamp = createPurchaseInvoiceDto.taxStampId
      ? await this.taxService.findOneById(createPurchaseInvoiceDto.taxStampId)
      : null;

    const totalAfterGeneralDiscount =
      this.calculationsService.calculateTotalDiscount(
        total,
        createPurchaseInvoiceDto.discount,
        createPurchaseInvoiceDto.discount_type,
        taxStamp?.value || 0,
      );

    const lineItems = await this.articlePurchaseInvoiceEntryService.findManyAsLineItem(
      articleEntries.map((entry) => entry.id),
    );

    const taxSummary = await Promise.all(
      this.calculationsService
        .calculateTaxSummary(lineItems)
        .map(async (item) => {
          const tax = await this.taxService.findOneById(item.taxId);

          return {
            ...item,
            label: tax.label,
            value: tax.isRate ? tax.value * 100 : tax.value,
            isRate: tax.isRate,
          };
        }),
    );

    const sequential = await this.purchaseInvoiceSequenceService.getSequential();

    const purchaseInvoiceMetaData = await this.purchaseInvoiceMetaDataService.save({
      ...createPurchaseInvoiceDto.purchaseInvoiceMetaData,
      taxSummary,
    });

    let taxWithholdingAmount = 0;
    if (createPurchaseInvoiceDto.taxWithholdingId) {
      const taxWithholding = await this.taxWithholdingService.findOneById(
        createPurchaseInvoiceDto.taxWithholdingId,
      );

      if (taxWithholding.rate !== undefined && taxWithholding.rate !== null) {
        taxWithholdingAmount =
          totalAfterGeneralDiscount * (taxWithholding.rate / 100);
      }
    }

    const invoice = await this.purchaseInvoiceRepository.save({
      ...createPurchaseInvoiceDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      cabinetId: 1,
      sequential,
      articlePurchaseInvoiceEntries: articleEntries,
      purchaseInvoiceMetaData,
      subTotal,
      taxWithholdingAmount: taxWithholdingAmount || 0,
      total: totalAfterGeneralDiscount,
      amountPaid: 0,
    });

    if (createPurchaseInvoiceDto.uploads) {
      await Promise.all(
        createPurchaseInvoiceDto.uploads.map((u) =>
          this.purchaseInvoiceStorageService.save(invoice.id, u.uploadId),
        ),
      );
    }

    return invoice;
  }

  async saveMany(
    createPurchaseInvoiceDtos: CreatePurchaseInvoiceDto[],
  ): Promise<PurchaseInvoiceEntity[]> {
    const invoices = [];
    for (const dto of createPurchaseInvoiceDtos) {
      const invoice = await this.save(dto);
      invoices.push(invoice);
    }
    return invoices;
  }

  @Transactional()
  async saveFromQuotation(purchaseQuotation: PurchaseQuotationEntity): Promise<PurchaseInvoiceEntity> {
    return this.save({
      purchaseQuotationId: purchaseQuotation.id,
      currencyId: purchaseQuotation.currencyId,
      bankAccountId: purchaseQuotation.bankAccountId,
      interlocutorId: purchaseQuotation.interlocutorId,
      firmId: purchaseQuotation.firmId,
      discount: purchaseQuotation.discount,
      discount_type: purchaseQuotation.discount_type,
      object: purchaseQuotation.object,
      status: PURCHASE_INVOICE_STATUS.Draft,
      date: new Date(),
      dueDate: null,
      articlePurchaseInvoiceEntries: purchaseQuotation.articlePurchaseQuotationEntries.map((entry) => {
        return {
          unit_price: entry.unit_price,
          quantity: entry.quantity,
          discount: entry.discount,
          discount_type: entry.discount_type,
          subTotal: entry.subTotal,
          total: entry.total,
          articleId: entry.article.id,
          article: entry.article,
          taxes: entry.articlePurchaseQuotationEntryTaxes.map((entry) => {
            return entry.taxId;
          }),
        };
      }),
    });
  }

  @Transactional()
  async update(
    id: number,
    updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
  ): Promise<PurchaseInvoiceEntity> {
    const { uploads: existingUploads, ...existingInvoice } =
      await this.purchaseInvoiceRepository.findOne({
        where: { id },
        relations: [
          'articlePurchaseInvoiceEntries',
          'purchaseInvoiceMetaData',
          'uploads',
          'taxWithholding',
        ],
      });

    const [firm, bankAccount, currency, interlocutor] = await Promise.all([
      this.firmService.findOneByCondition({
        filter: `id||$eq||${updatePurchaseInvoiceDto.firmId}`,
      }),
      updatePurchaseInvoiceDto.bankAccountId
        ? this.bankAccountService.findOneById(updatePurchaseInvoiceDto.bankAccountId)
        : null,
      updatePurchaseInvoiceDto.currencyId
        ? this.currencyService.findOneById(updatePurchaseInvoiceDto.currencyId)
        : null,
      updatePurchaseInvoiceDto.interlocutorId
        ? this.interlocutorService.findOneById(updatePurchaseInvoiceDto.interlocutorId)
        : null,
    ]);

    const existingArticles =
      await this.articlePurchaseInvoiceEntryService.softDeleteMany(
        existingInvoice.articlePurchaseInvoiceEntries.map((entry) => entry.id),
      );

    const articleEntries: ArticlePurchaseInvoiceEntryEntity[] =
      updatePurchaseInvoiceDto.articlePurchaseInvoiceEntries
        ? await this.articlePurchaseInvoiceEntryService.saveMany(
            updatePurchaseInvoiceDto.articlePurchaseInvoiceEntries,
          )
        : existingArticles;

    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    const taxStamp = updatePurchaseInvoiceDto.taxStampId
      ? await this.taxService.findOneById(updatePurchaseInvoiceDto.taxStampId)
      : null;

    const totalAfterGeneralDiscount =
      this.calculationsService.calculateTotalDiscount(
        total,
        updatePurchaseInvoiceDto.discount,
        updatePurchaseInvoiceDto.discount_type,
        taxStamp?.value || 0,
      );

    const lineItems = await this.articlePurchaseInvoiceEntryService.findManyAsLineItem(
      articleEntries.map((entry) => entry.id),
    );

    const taxSummary = await Promise.all(
      this.calculationsService
        .calculateTaxSummary(lineItems)
        .map(async (item) => {
          const tax = await this.taxService.findOneById(item.taxId);

          return {
            ...item,
            label: tax.label,
            rate: tax.isRate ? tax.value * 100 : tax.value,
            isRate: tax.isRate,
          };
        }),
    );

    const purchaseInvoiceMetaData = await this.purchaseInvoiceMetaDataService.save({
      ...existingInvoice.purchaseInvoiceMetaData,
      ...updatePurchaseInvoiceDto.purchaseInvoiceMetaData,
      taxSummary,
    });

    let taxWithholdingAmount = 0;
    if (updatePurchaseInvoiceDto.taxWithholdingId) {
      const taxWithholding = await this.taxWithholdingService.findOneById(
        updatePurchaseInvoiceDto.taxWithholdingId,
      );

      if (taxWithholding.rate !== undefined && taxWithholding.rate !== null) {
        taxWithholdingAmount = ciel(
          totalAfterGeneralDiscount * (taxWithholding.rate / 100),
          currency.digitAfterComma + 1,
        );
      }
    }

    const updatedUploads = await Promise.all(
      updatePurchaseInvoiceDto.uploads.map((u) =>
        this.purchaseInvoiceStorageService.findOneById(u.id),
      ),
    );

    const {
      keptItems: keptUploads,
      newItems: newUploads,
      eliminatedItems: eliminatedUploads,
    } = await this.purchaseInvoiceRepository.updateAssociations<
      Pick<PurchaseInvoiceStorageEntity, 'id' | 'purchaseInvoiceId' | 'uploadId'>
    >({
      keys: ['purchaseInvoiceId', 'uploadId'],
      updatedItems: updatedUploads,
      existingItems: existingUploads,
      onCreate: (entity) =>
        this.purchaseInvoiceStorageService.save(entity.purchaseInvoiceId, entity.uploadId),
      onDelete: (id: number) =>
        this.purchaseInvoiceStorageService.softDelete(existingUploads[id].id),
    });

    return this.purchaseInvoiceRepository.save({
      ...updatePurchaseInvoiceDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      interlocutorId: interlocutor ? interlocutor.id : null,
      articlePurchaseInvoiceEntries: articleEntries,
      purchaseInvoiceMetaData,
      taxStampId: taxStamp ? taxStamp.id : null,
      subTotal,
      taxWithholdingAmount,
      total: totalAfterGeneralDiscount,
      uploads: [...keptUploads, ...newUploads, ...eliminatedUploads],
    });
  }

  async updateFields(
    id: number,
    updatePurchaseInvoiceDto: UpdatePurchaseInvoiceDto,
  ): Promise<PurchaseInvoiceEntity> {
    return this.purchaseInvoiceRepository.update(id, updatePurchaseInvoiceDto);
  }

  async duplicate(id: number, includeFiles: boolean): Promise<ResponsePurchaseInvoiceDto> {
    const existingInvoice = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: new String().concat(
        'purchaseInvoiceMetaData,',
        'articlePurchaseInvoiceEntries,',
        'articlePurchaseInvoiceEntries.articlePurchaseInvoiceEntryTaxes,',
        'uploads',
      ),
    });
    const purchaseInvoiceMetaData = await this.purchaseInvoiceMetaDataService.duplicate(
      existingInvoice.purchaseInvoiceMetaData.id,
    );
    const sequential = await this.purchaseInvoiceSequenceService.getSequential();
    const invoice = await this.purchaseInvoiceRepository.save({
      ...existingInvoice,
      id: undefined,
      sequential,
      purchaseInvoiceMetaData,
      articlePurchaseInvoiceEntries: [],
      uploads: [],
      amountPaid: 0,
      status: PURCHASE_INVOICE_STATUS.Draft,
    });

    const articlePurchaseInvoiceEntries =
      await this.articlePurchaseInvoiceEntryService.duplicateMany(
        existingInvoice.articlePurchaseInvoiceEntries.map((entry) => entry.id),
        invoice.id,
      );

    const uploads = includeFiles
      ? await this.purchaseInvoiceStorageService.duplicateMany(
          existingInvoice.uploads.map((upload) => upload.id),
          invoice.id,
        )
      : [];

    return this.purchaseInvoiceRepository.save({
      ...invoice,
      articlePurchaseInvoiceEntries,
      uploads,
    });
  }

  async updateMany(
    updatePurchaseInvoiceDtos: UpdatePurchaseInvoiceDto[],
  ): Promise<PurchaseInvoiceEntity[]> {
    return this.purchaseInvoiceRepository.updateMany(updatePurchaseInvoiceDtos);
  }

  async updateInvoiceSequence(
    updatedSequenceDto: UpdatePurchaseInvoiceSequenceDto,
  ): Promise<SequenceEntity> {
    return this.purchaseInvoiceSequenceService.set(updatedSequenceDto);
  }

  async softDelete(id: number): Promise<PurchaseInvoiceEntity> {
    await this.findOneById(id);
    return this.purchaseInvoiceRepository.softDelete(id);
  }

  async deleteAll() {
    return this.purchaseInvoiceRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.purchaseInvoiceRepository.getTotalCount();
  }
}
