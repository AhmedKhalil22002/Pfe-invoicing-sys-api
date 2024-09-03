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

@Injectable()
export class QuotationService {
  constructor(
    //quotation repository
    private readonly quotationRepository: QuotationRepository,
    //other entity services
    private readonly currencyService: CurrencyService,
    private readonly articleQuotationEntryService: ArticleQuotationEntryService,
    private readonly firmService: FirmService,
    private readonly calculationsService: InvoicingCalculationsService,
    private readonly interlocutorService: InterlocutorService,
    private readonly quotationSequenceService: QuotationSequenceService,
    private readonly quotationMetaDataService: QuotationMetaDataService,

    //pdf service
    private readonly pdfService: PdfService,
  ) {}

  async downloadPdf(id: number, template: string): Promise<StreamableFile> {
    const quotation = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: new String().concat(
        'firm,',
        'cabinet,',
        'currency,',
        'interlocutor,',
        'cabinet.address,',
        'quotationMetaData',
        'firm.deliveryAddress,',
        'firm.invoicingAddress,',
        'articleQuotationEntries,',
        'articleQuotationEntries.article,',
        'articleQuotationEntries.articleQuotationEntryTaxes,',
        'articleQuotationEntries.articleQuotationEntryTaxes.tax',
      ),
    });
    if (quotation) {
      const data = {
        meta: {
          type: 'DEVIS',
        },
        quotation: {
          ...quotation,
          date: format(quotation.date, 'dd/MM/yyyy'),
          dueDate: format(quotation.dueDate, 'dd/MM/yyyy'),
        },
      };

      const pdfBuffer = await this.pdfService.generatePdf(data, template);
      return new StreamableFile(pdfBuffer);
    } else {
      throw new QuotationNotFoundException();
    }
  }

  async findOneById(id: number): Promise<ResponseQuotationDto> {
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

  async findAll(query: IQueryObject): Promise<ResponseQuotationDto[]> {
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
    const taxSummary = this.calculationsService.calculateTaxSummary(lineItems);

    //gte the latest sequential
    const sequential = await this.quotationSequenceService.getSequential();

    //save quotation metadata
    const quotationMetaData = await this.quotationMetaDataService.save({
      ...createQuotationDto.quotationMetaData,
      taxSummary,
    });

    //save quotation
    return this.quotationRepository.save({
      ...createQuotationDto,
      sequential,
      currencyId: firm.currencyId,
      articleQuotationEntries: articleEntries,
      quotationMetaData,
      subTotal: subTotal,
      total: totalAfterGeneralDiscountAndTaxStamp,
    });
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

  async update(
    id: number,
    updateQuotationDto: UpdateQuotationDto,
  ): Promise<QuotationEntity> {
    //retrieve the quotation that have to be updated
    const existingQuotation = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'articleQuotationEntries,quotationMetaData',
    });

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
    const taxSummary = this.calculationsService.calculateTaxSummary(lineItems);

    //save quotation metadata
    const quotationMetaData = await this.quotationMetaDataService.save({
      ...existingQuotation.quotationMetaData,
      ...updateQuotationDto.quotationMetaData,
      taxSummary,
    });

    return this.quotationRepository.save({
      ...existingQuotation,
      ...updateQuotationDto,
      currencyId: firm.currencyId,
      articleQuotationEntries: articleEntries,
      quotationMetaData,
      subTotal: subTotal,
      total: totalAfterGeneralDiscountAndTaxStamp,
    });
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
