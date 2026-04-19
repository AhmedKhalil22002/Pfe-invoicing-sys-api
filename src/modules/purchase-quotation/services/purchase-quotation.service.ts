import { Injectable, StreamableFile } from '@nestjs/common';
import { PurchaseQuotationEntity } from '../entities/purchase-quotation.entity';
import { PurchaseQuotationNotFoundException } from '../errors/purchase-quotation.notfound.error';
import { ResponsePurchaseQuotationDto } from '../dtos/purchase-quotation.response.dto';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { CreatePurchaseQuotationDto } from '../dtos/purchase-quotation.create.dto';
import { UpdatePurchaseQuotationDto } from '../dtos/purchase-quotation.update.dto';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { FirmService } from 'src/modules/firm/services/firm.service';
import { InterlocutorService } from 'src/modules/interlocutor/services/interlocutor.service';
import { InvoicingCalculationsService } from 'src/shared/calculations/services/invoicing.calculations.service';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ArticlePurchaseQuotationEntryService } from './article-purchase-quotation-entry.service';
import { ArticlePurchaseQuotationEntryEntity } from '../entities/article-purchase-quotation-entry.entity';
import { PdfService } from 'src/shared/pdf/services/pdf.service';
import { format, isAfter } from 'date-fns';
import { PurchaseQuotationSequenceService } from './purchase-quotation-sequence.service';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PurchaseQuotationMetaDataService } from './purchase-quotation-meta-data.service';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { BankAccountService } from 'src/modules/bank-account/services/bank-account.service';
import { PurchaseQuotationStorageService } from './purchase-quotation-upload.service';
import { ResponsePurchaseQuotationUploadDto } from '../dtos/purchase-quotation-upload.response.dto';
import { PurchaseQuotationSequence } from '../interfaces/purchase-quotation-sequence.interface';
import { UpdatePurchaseQuotationSequenceDto } from '../dtos/purchase-quotation-seqence.update.dto';
import { Transactional } from '@nestjs-cls/transactional';
import { DuplicatePurchaseQuotationDto } from '../dtos/purchase-quotation.duplicate.dto';
import { PURCHASE_QUOTATION_STATUS } from '../enums/purchase-quotation-status.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PurchaseQuotationRepository } from '../repositories/purchase-quotation.repository';

@Injectable()
export class PurchaseQuotationService {
  constructor(
    //repositories
    private readonly purchaseQuotationRepository: PurchaseQuotationRepository,
    //entity services
    private readonly articlePurchaseQuotationEntryService: ArticlePurchaseQuotationEntryService,
    private readonly purchaseQuotationStorageService: PurchaseQuotationStorageService,
    private readonly bankAccountService: BankAccountService,
    private readonly currencyService: CurrencyService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
    private readonly purchaseQuotationSequenceService: PurchaseQuotationSequenceService,
    private readonly purchaseQuotationMetaDataService: PurchaseQuotationMetaDataService,
    private readonly taxService: TaxService,

    //abstract services
    private readonly calculationsService: InvoicingCalculationsService,
    private readonly pdfService: PdfService,
  ) {}

  async downloadPdf(id: number, template: string): Promise<StreamableFile> {
    const purchaseQuotation = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: new String().concat(
        'firm,',
        'cabinet,',
        'currency,',
        'bankAccount,',
        'interlocutor,',
        'cabinet.address,',
        'purchaseQuotationMetaData,',
        'firm.deliveryAddress,',
        'firm.invoicingAddress,',
        'articlePurchaseQuotationEntries,',
        'articlePurchaseQuotationEntries.article,',
        'articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes,',
        'articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes.tax',
      ),
    });
    const digitsAferComma = purchaseQuotation.currency.digitAfterComma;
    if (purchaseQuotation) {
      const data = {
        meta: { ...purchaseQuotation.purchaseQuotationMetaData, type: 'DEVIS' },
        purchaseQuotation: {
          ...purchaseQuotation,
          date: format(purchaseQuotation.date, 'dd/MM/yyyy'),
          dueDate: format(purchaseQuotation.dueDate, 'dd/MM/yyyy'),
          taxSummary: purchaseQuotation.purchaseQuotationMetaData.taxSummary,
          subTotal: purchaseQuotation.subTotal.toFixed(digitsAferComma),
          total: purchaseQuotation.total.toFixed(digitsAferComma),
        },
      };

      const pdfBuffer = await this.pdfService.generatePdf(data, template);
      return new StreamableFile(new Uint8Array(pdfBuffer));
    } else {
      throw new PurchaseQuotationNotFoundException();
    }
  }

  async findOneById(id: number): Promise<PurchaseQuotationEntity> {
    const purchaseQuotation = await this.purchaseQuotationRepository.findOneById(id);
    if (!purchaseQuotation) {
      throw new PurchaseQuotationNotFoundException();
    }
    return purchaseQuotation;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<PurchaseQuotationEntity | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const purchaseQuotation = await this.purchaseQuotationRepository.findOne(
      queryOptions as FindOneOptions<PurchaseQuotationEntity>,
    );
    if (!purchaseQuotation) return null;
    return purchaseQuotation;
  }

  async findAll(query: IQueryObject = {}): Promise<PurchaseQuotationEntity[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.purchaseQuotationRepository.findAll(
      queryOptions as FindManyOptions<PurchaseQuotationEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponsePurchaseQuotationDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.purchaseQuotationRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.purchaseQuotationRepository.findAll(
      queryOptions as FindManyOptions<PurchaseQuotationEntity>,
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
  async save(createPurchaseQuotationDto: CreatePurchaseQuotationDto): Promise<PurchaseQuotationEntity> {
    // Parallelize fetching firm, bank account, and currency, as they are independent
    const [firm, bankAccount, currency] = await Promise.all([
      this.firmService.findOneByCondition({
        filter: `id||$eq||${createPurchaseQuotationDto.firmId}`,
      }),
      createPurchaseQuotationDto.bankAccountId
        ? this.bankAccountService.findOneById(createPurchaseQuotationDto.bankAccountId)
        : Promise.resolve(null),
      createPurchaseQuotationDto.currencyId
        ? this.currencyService.findOneById(createPurchaseQuotationDto.currencyId)
        : Promise.resolve(null),
    ]);

    if (!firm) {
      throw new Error('Firm not found'); // Handle firm not existing
    }

    // Check interlocutor existence
    await this.interlocutorService.findOneById(
      createPurchaseQuotationDto.interlocutorId,
    );

    // Save article entries if provided
    const articleEntries =
      createPurchaseQuotationDto.articlePurchaseQuotationEntries &&
      (await this.articlePurchaseQuotationEntryService.saveMany(
        createPurchaseQuotationDto.articlePurchaseQuotationEntries,
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

    // Apply general discount
    const totalAfterGeneralDiscount =
      this.calculationsService.calculateTotalDiscount(
        total,
        createPurchaseQuotationDto.discount,
        createPurchaseQuotationDto.discount_type,
      );

    // Format articleEntries as lineItems for tax calculations
    const lineItems =
      await this.articlePurchaseQuotationEntryService.findManyAsLineItem(
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

    // Fetch the latest sequential number for purchaseQuotation
    const sequential = await this.purchaseQuotationSequenceService.getSequential();

    // Save purchaseQuotation metadata
    const purchaseQuotationMetaData = await this.purchaseQuotationMetaDataService.save({
      ...createPurchaseQuotationDto.purchaseQuotationMetaData,
      taxSummary,
    });

    // Save the purchaseQuotation entity
    const purchaseQuotation = await this.purchaseQuotationRepository.save({
      ...createPurchaseQuotationDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      sequential,
      articlePurchaseQuotationEntries: articleEntries,
      purchaseQuotationMetaData,
      subTotal,
      total: totalAfterGeneralDiscount,
    });

    // Handle file uploads if they exist
    if (createPurchaseQuotationDto.uploads) {
      await Promise.all(
        createPurchaseQuotationDto.uploads.map((u) =>
          this.purchaseQuotationStorageService.save(purchaseQuotation.id, u.uploadId),
        ),
      );
    }

    return purchaseQuotation;
  }

  async saveMany(
    createPurchaseQuotationDtos: CreatePurchaseQuotationDto[],
  ): Promise<PurchaseQuotationEntity[]> {
    const purchaseQuotations = [];
    for (const createPurchaseQuotationDto of createPurchaseQuotationDtos) {
      const purchaseQuotation = await this.save(createPurchaseQuotationDto);
      purchaseQuotations.push(purchaseQuotation);
    }
    return purchaseQuotations;
  }

  async updatePurchaseQuotationUploads(
    id: number,
    updatePurchaseQuotationDto: UpdatePurchaseQuotationDto,
    existingUploads: ResponsePurchaseQuotationUploadDto[],
  ) {
    const newUploads = [];
    const keptUploads = [];
    const eliminatedUploads = [];

    if (updatePurchaseQuotationDto.uploads) {
      for (const upload of existingUploads) {
        const exists = updatePurchaseQuotationDto.uploads.some(
          (u) => u.id === upload.id,
        );
        if (!exists)
          eliminatedUploads.push(
            await this.purchaseQuotationStorageService.softDelete(upload.id),
          );
        else keptUploads.push(upload);
      }
      for (const upload of updatePurchaseQuotationDto.uploads) {
        if (!upload.id)
          newUploads.push(
            await this.purchaseQuotationStorageService.save(id, upload.uploadId),
          );
      }
    }
    return { keptUploads, newUploads, eliminatedUploads };
  }

  @Transactional()
  async update(
    id: number,
    updatePurchaseQuotationDto: UpdatePurchaseQuotationDto,
  ): Promise<PurchaseQuotationEntity> {
    // Retrieve the existing purchaseQuotation with necessary relations
    const { uploads: existingUploads, ...existingPurchaseQuotation } =
      await this.findOneByCondition({
        filter: `id||$eq||${id}`,
        join: 'articlePurchaseQuotationEntries,purchaseQuotationMetaData,uploads',
      });

    // Fetch and validate related entities in parallel to optimize performance
    const [firm, bankAccount, currency, interlocutor] = await Promise.all([
      this.firmService.findOneByCondition({
        filter: `id||$eq||${updatePurchaseQuotationDto.firmId}`,
      }),
      updatePurchaseQuotationDto.bankAccountId
        ? this.bankAccountService.findOneById(updatePurchaseQuotationDto.bankAccountId)
        : null,
      updatePurchaseQuotationDto.currencyId
        ? this.currencyService.findOneById(updatePurchaseQuotationDto.currencyId)
        : null,
      updatePurchaseQuotationDto.interlocutorId
        ? this.interlocutorService.findOneById(
            updatePurchaseQuotationDto.interlocutorId,
          )
        : null,
    ]);

    // Soft delete old article entries to prepare for new ones
    const existingArticles =
      await this.articlePurchaseQuotationEntryService.softDeleteMany(
        existingPurchaseQuotation.articlePurchaseQuotationEntries.map((entry) => entry.id),
      );

    // Save new article entries
    const articleEntries: ArticlePurchaseQuotationEntryEntity[] =
      updatePurchaseQuotationDto.articlePurchaseQuotationEntries
        ? await this.articlePurchaseQuotationEntryService.saveMany(
            updatePurchaseQuotationDto.articlePurchaseQuotationEntries,
          )
        : existingArticles;

    // Calculate the subtotal and total for the new entries
    const { subTotal, total } =
      this.calculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    // Apply general discount
    const totalAfterGeneralDiscount =
      this.calculationsService.calculateTotalDiscount(
        total,
        updatePurchaseQuotationDto.discount,
        updatePurchaseQuotationDto.discount_type,
      );

    // Convert article entries to line items for further calculations
    const lineItems =
      await this.articlePurchaseQuotationEntryService.findManyAsLineItem(
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

    // Save or update the purchaseQuotation metadata with the updated tax summary
    const purchaseQuotationMetaData = await this.purchaseQuotationMetaDataService.save({
      ...existingPurchaseQuotation.purchaseQuotationMetaData,
      ...updatePurchaseQuotationDto.purchaseQuotationMetaData,
      taxSummary,
    });

    // Handle uploads - manage existing, new, and eliminated uploads
    const { keptUploads, newUploads, eliminatedUploads } =
      await this.updatePurchaseQuotationUploads(
        existingPurchaseQuotation.id,
        updatePurchaseQuotationDto,
        existingUploads,
      );

    // Save and return the updated purchaseQuotation with all updated details
    return this.purchaseQuotationRepository.save({
      ...updatePurchaseQuotationDto,
      bankAccountId: bankAccount ? bankAccount.id : null,
      currencyId: currency ? currency.id : firm.currencyId,
      interlocutorId: interlocutor ? interlocutor.id : null,
      articlePurchaseQuotationEntries: articleEntries,
      purchaseQuotationMetaData,
      subTotal,
      total: totalAfterGeneralDiscount,
      uploads: [...keptUploads, ...newUploads, ...eliminatedUploads],
    });
  }

  async duplicate(
    duplicatePurchaseQuotationDto: DuplicatePurchaseQuotationDto,
  ): Promise<ResponsePurchaseQuotationDto> {
    const existingPurchaseQuotation = await this.findOneByCondition({
      filter: `id||$eq||${duplicatePurchaseQuotationDto.id}`,
      join: new String().concat(
        'purchaseQuotationMetaData,',
        'articlePurchaseQuotationEntries,',
        'articlePurchaseQuotationEntries.articlePurchaseQuotationEntryTaxes,',
        'uploads',
      ),
    });
    const purchaseQuotationMetaData = await this.purchaseQuotationMetaDataService.duplicate(
      existingPurchaseQuotation.purchaseQuotationMetaData.id,
    );
    const sequential = await this.purchaseQuotationSequenceService.getSequential();
    const purchaseQuotation = await this.purchaseQuotationRepository.save({
      ...existingPurchaseQuotation,
      sequential,
      purchaseQuotationMetaData,
      articlePurchaseQuotationEntries: [],
      uploads: [],
      id: undefined,
      status: PURCHASE_QUOTATION_STATUS.Draft,
    });
    const articlePurchaseQuotationEntries =
      await this.articlePurchaseQuotationEntryService.duplicateMany(
        existingPurchaseQuotation.articlePurchaseQuotationEntries.map((entry) => entry.id),
        purchaseQuotation.id,
      );

    const uploads = duplicatePurchaseQuotationDto.includeFiles
      ? await this.purchaseQuotationStorageService.duplicateMany(
          existingPurchaseQuotation.uploads.map((upload) => upload.id),
          purchaseQuotation.id,
        )
      : [];

    return this.purchaseQuotationRepository.save({
      ...purchaseQuotation,
      articlePurchaseQuotationEntries,
      uploads,
    });
  }

  async updateStatus(
    id: number,
    status: PURCHASE_QUOTATION_STATUS,
  ): Promise<PurchaseQuotationEntity> {
    const purchaseQuotation = await this.purchaseQuotationRepository.findOneById(id);
    return this.purchaseQuotationRepository.save({ id: purchaseQuotation.id, status });
  }

  async updateMany(
    updatePurchaseQuotationDtos: UpdatePurchaseQuotationDto[],
  ): Promise<PurchaseQuotationEntity[]> {
    return this.purchaseQuotationRepository.updateMany(updatePurchaseQuotationDtos);
  }

  async updatePurchaseQuotationSequence(
    updatedSequenceDto: UpdatePurchaseQuotationSequenceDto,
  ): Promise<PurchaseQuotationSequence> {
    return this.purchaseQuotationSequenceService.set(updatedSequenceDto);
  }

  @Transactional()
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredPurchaseQuotations() {
    const currentDate = new Date();
    const expiredPurchaseQuotations: PurchaseQuotationEntity[] =
      await this.purchaseQuotationRepository.findAll({
        where: { status: PURCHASE_QUOTATION_STATUS.Sent },
      });
    const purchaseQuotationsToExpire = expiredPurchaseQuotations.filter((purchaseQuotation) =>
      isAfter(currentDate, new Date(purchaseQuotation.dueDate)),
    );

    if (purchaseQuotationsToExpire.length) {
      for (const purchaseQuotation of purchaseQuotationsToExpire) {
        purchaseQuotation.status = PURCHASE_QUOTATION_STATUS.Expired;
        await this.purchaseQuotationRepository.save(purchaseQuotation);
      }
    }
  }

  async softDelete(id: number): Promise<PurchaseQuotationEntity> {
    await this.findOneById(id);
    return this.purchaseQuotationRepository.softDelete(id);
  }

  async deleteAll() {
    return this.purchaseQuotationRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.purchaseQuotationRepository.getTotalCount();
  }
}
