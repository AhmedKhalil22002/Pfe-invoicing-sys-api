import { Injectable, StreamableFile } from '@nestjs/common';
import { QuotationRepository } from '../repositories/repository/quotation.repository';
import { QuotationEntity } from '../repositories/entities/quotation.entity';
import { QuotationNotFoundException } from '../errors/quotation.notfound.error';
import { ResponseQuotationDto } from '../dtos/quotation.response.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateQuotationDto } from '../dtos/quotation.create.dto';
import { UpdateQuotationDto } from '../dtos/quotation.update.dto';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { FirmService } from 'src/modules/firm/services/firm.service';
import { InterlocutorService } from 'src/modules/interlocutor/services/interlocutor.service';
import { InvoicingCalculationsService } from 'src/common/calculations/services/invoicing.calculations.service';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ArticleQuotationEntryService } from './article-quotation-entry.service';
import { ArticleQuotationEntryEntity } from '../repositories/entities/article-quotation-entry.entity';
import { PdfService } from 'src/common/pdf/services/pdf.service';
import { format } from 'date-fns';
import { QuotationSequenceService } from './quotation-sequence.service';
import { QueryBuilder } from 'src/common/database/utils/database-query-builder';
import { QuotationMetaDataService } from './quotation-meta-data.service';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { BankAccountService } from 'src/modules/bank-account/services/bank-account.service';
import { QuotationUploadService } from './quotation-upload.service';
import { ResponseQuotationUploadDto } from '../dtos/quotation-upload.response.dto';

@Injectable()
export class QuotationService {
  constructor(
    //repositories
    private readonly quotationRepository: QuotationRepository,
    //entity services
    private readonly articleQuotationEntryService: ArticleQuotationEntryService,
    private readonly quotationUploadService: QuotationUploadService,
    private readonly bankAccountService: BankAccountService,
    private readonly currencyService: CurrencyService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
    private readonly quotationSequenceService: QuotationSequenceService,
    private readonly quotationMetaDataService: QuotationMetaDataService,
    private readonly taxService: TaxService,

    //abstract services
    private readonly calculationsService: InvoicingCalculationsService,
    private readonly pdfService: PdfService,
  ) {}

  async downloadPdf(id: number, template: string): Promise<StreamableFile> {
    const quotation = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: new String().concat(
        'firm,',
        'cabinet,',
        'currency,',
        'bankAccount,',
        'interlocutor,',
        'cabinet.address,',
        'quotationMetaData,',
        'firm.deliveryAddress,',
        'firm.invoicingAddress,',
        'articleQuotationEntries,',
        'articleQuotationEntries.article,',
        'articleQuotationEntries.articleQuotationEntryTaxes,',
        'articleQuotationEntries.articleQuotationEntryTaxes.tax',
      ),
    });
    const digitsAferComma = quotation.currency.digitAfterComma;
    if (quotation) {
      const data = {
        meta: {
          ...quotation.quotationMetaData,
          type: 'DEVIS',
        },
        quotation: {
          ...quotation,
          date: format(quotation.date, 'dd/MM/yyyy'),
          dueDate: format(quotation.dueDate, 'dd/MM/yyyy'),
          taxSummaury: quotation.quotationMetaData.taxSummary,
          subTotal: quotation.subTotal.toFixed(digitsAferComma),
          total: quotation.total.toFixed(digitsAferComma),
        },
      };

      const pdfBuffer = await this.pdfService.generatePdf(data, template);
      return new StreamableFile(pdfBuffer);
    } else {
      throw new QuotationNotFoundException();
    }
  }

  async findOneById(id: number): Promise<QuotationEntity> {
    const quotation = await this.quotationRepository.findOneById(id);
    if (!quotation) {
      throw new QuotationNotFoundException();
    }
    return quotation;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponseQuotationDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const quotation = await this.quotationRepository.findOne(
      queryOptions as FindOneOptions<QuotationEntity>,
    );
    if (!quotation) return null;
    return quotation;
  }

  async findAll(query: IQueryObject = {}): Promise<QuotationEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.quotationRepository.findAll(
      queryOptions as FindManyOptions<QuotationEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponseQuotationDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.quotationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.quotationRepository.findAll(
      queryOptions as FindManyOptions<QuotationEntity>,
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

  async save(createQuotationDto: CreateQuotationDto): Promise<QuotationEntity> {
    //fetch the firm in order to check its existance and later get its currency
    const firm = await this.firmService.findOneByCondition({
      filter: `id||$eq||${createQuotationDto.firmId}`,
    });

    //fetch bank account in order to check its existance
    const bankAccount = createQuotationDto.bankAccountId
      ? await this.bankAccountService.findOneById(
          createQuotationDto.bankAccountId,
        )
      : null;

    //fetch currency in order to check its existance
    const currency = createQuotationDto.currencyId
      ? await this.currencyService.findOneById(createQuotationDto.currencyId)
      : null;

    //fetch the interlocutor in order to check its existance
    await this.interlocutorService.findOneById(
      createQuotationDto.interlocutorId,
    );

    //retrieve the currency information
    await this.currencyService.findOneById(firm.currencyId);

    //save article entries
    const articleEntries =
      createQuotationDto.articleQuotationEntries &&
      (await this.articleQuotationEntryService.saveMany(
        createQuotationDto.articleQuotationEntries,
      ));

    // calculate the financial informations of the quotation
    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    // apply taxstamp and general discount
    const totalAfterGeneralDiscountAndTaxStamp =
      this.calculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        createQuotationDto.discount,
        createQuotationDto.discount_type,
        createQuotationDto.taxStamp || 0,
      );

    // format articleEntries for calculation
    const lineItems =
      await this.articleQuotationEntryService.findManyAsLineItem(
        articleEntries.map((entry) => entry.id),
      );

    // calculate tax summary
    const taxSummary = await Promise.all(
      this.calculationsService
        .calculateTaxSummary(lineItems)
        .map(async (item) => {
          const tax = await this.taxService.findOneById(item.taxId);
          return {
            ...item,
            label: tax.label,
            rate: tax.rate * 100,
          };
        }),
    );

    //get the latest sequential
    const sequential = await this.quotationSequenceService.getSequential();

    //save quotation metadata
    const quotationMetaData = await this.quotationMetaDataService.save({
      ...createQuotationDto.quotationMetaData,
      taxSummary,
    });

    //save quotation
    const quotation = await this.quotationRepository.save({
      ...createQuotationDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      sequential,
      articleQuotationEntries: articleEntries,
      quotationMetaData,
      subTotal: subTotal,
      total: totalAfterGeneralDiscountAndTaxStamp,
    });

    //handle file uploads
    if (createQuotationDto.uploads)
      for (const u of createQuotationDto.uploads)
        this.quotationUploadService.save(quotation.id, u.uploadId);

    return quotation;
  }

  async saveMany(
    createQuotationDtos: CreateQuotationDto[],
  ): Promise<QuotationEntity[]> {
    const quotations = [];
    for (const createQuotationDto of createQuotationDtos) {
      const quotation = await this.save(createQuotationDto);
      quotations.push(quotation);
    }
    return quotations;
  }

  async updateQuotationUploads(
    id: number,
    updateQuotationDto: UpdateQuotationDto,
    existingUploads: ResponseQuotationUploadDto[],
  ) {
    const newUploads = [];
    const keptUploads = [];
    const eliminatedUploads = [];

    if (updateQuotationDto.uploads) {
      for (const upload of existingUploads) {
        const exists = updateQuotationDto.uploads.some(
          (u) => u.id === upload.id,
        );
        if (!exists)
          eliminatedUploads.push(
            await this.quotationUploadService.softDelete(upload.id),
          );
        else keptUploads.push(upload);
      }
      for (const upload of updateQuotationDto.uploads) {
        if (!upload.id)
          newUploads.push(
            await this.quotationUploadService.save(id, upload.uploadId),
          );
      }
    }
    return {
      keptUploads,
      newUploads,
      eliminatedUploads,
    };
  }

  async update(
    id: number,
    updateQuotationDto: UpdateQuotationDto,
  ): Promise<QuotationEntity> {
    //retrieve the quotation that have to be updated

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { uploads: existingUploads, ...existingQuotation } =
      await this.findOneByCondition({
        filter: `id||$eq||${id}`,
        join: 'articleQuotationEntries,quotationMetaData,uploads',
      });

    //fetch bank account in order to check its existance
    const bankAccount = updateQuotationDto.bankAccountId
      ? await this.bankAccountService.findOneById(
          updateQuotationDto.bankAccountId,
        )
      : null;

    //fetch currency in order to check its existance
    const currency = updateQuotationDto.currencyId
      ? await this.currencyService.findOneById(updateQuotationDto.currencyId)
      : null;

    //fetch the firm in order to check its existance and later get its currency
    const firm = await this.firmService.findOneByCondition({
      filter: `id||$eq||${updateQuotationDto.firmId}`,
    });

    //fetch the interlocutor in order to check its existance
    await this.interlocutorService.findOneById(
      updateQuotationDto.interlocutorId,
    );

    //retrieve the currency informations
    await this.currencyService.findOneById(firm.currencyId);

    //perform soft delete for old entries
    this.articleQuotationEntryService.softDeleteMany(
      existingQuotation.articleQuotationEntries.map((entry) => entry.id),
    );

    //save the new article entries
    const articleEntries: ArticleQuotationEntryEntity[] =
      await this.articleQuotationEntryService.saveMany(
        updateQuotationDto.articleQuotationEntries,
      );

    // calculate the financial informations of the quotation
    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );
    const totalAfterGeneralDiscountAndTaxStamp =
      this.calculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        updateQuotationDto.discount,
        updateQuotationDto.discount_type,
        updateQuotationDto.taxStamp || 0,
        //applying discount is set true by default
      );

    // format articleEntries for calculation
    const lineItems =
      await this.articleQuotationEntryService.findManyAsLineItem(
        articleEntries.map((entry) => entry.id),
      );

    // calculate tax summary
    const taxSummary = await Promise.all(
      this.calculationsService
        .calculateTaxSummary(lineItems)
        .map(async (item) => {
          const tax = await this.taxService.findOneById(item.taxId);
          return {
            ...item,
            label: tax.label,
            rate: tax.rate * 100,
          };
        }),
    );

    //save quotation metadata
    const quotationMetaData = await this.quotationMetaDataService.save({
      ...existingQuotation.quotationMetaData,
      ...updateQuotationDto.quotationMetaData,
      taxSummary,
    });

    const { keptUploads, newUploads, eliminatedUploads } =
      await this.updateQuotationUploads(
        existingQuotation.id,
        updateQuotationDto,
        existingUploads,
      );

    return this.quotationRepository.save({
      ...existingQuotation,
      ...updateQuotationDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      articleQuotationEntries: articleEntries,
      quotationMetaData,
      subTotal: subTotal,
      total: totalAfterGeneralDiscountAndTaxStamp,
      uploads: [...keptUploads, ...newUploads, ...eliminatedUploads],
    });
  }

  async updateMany(updateQuotationDtos: UpdateQuotationDto[]) {
    await this.quotationRepository.updateMany(updateQuotationDtos);
  }

  async softDelete(id: number): Promise<QuotationEntity> {
    await this.findOneById(id);
    return this.quotationRepository.softDelete(id);
  }

  async deleteAll() {
    return this.quotationRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.quotationRepository.getTotalCount();
  }
}
