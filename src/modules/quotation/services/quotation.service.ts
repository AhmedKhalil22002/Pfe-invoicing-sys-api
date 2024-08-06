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
import { QueryBuilder } from 'src/common/database/services/databse-query-options.service';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ArticleQuotationEntryService } from './article-quotation-entry.service';
import { ArticleQuotationEntryEntity } from '../repositories/entities/article-quotation-entry.entity';
import { PdfService } from 'src/common/pdf/services/pdf.service';
import { format } from 'date-fns';

@Injectable()
export class QuotationService {
  constructor(
    //quotation repository
    private readonly quotationRepository: QuotationRepository,
    //other entity services
    private readonly currencyService: CurrencyService,
    private readonly articleQuotationEntryService: ArticleQuotationEntryService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
    //pdf service
    private readonly pdfService: PdfService,
  ) {}

  async downloadPdf(id: number): Promise<StreamableFile> {
    const quotation = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: new String().concat(
        'cabinet,',
        'cabinet.address,',
        'firm,',
        'firm.invoicingAddress,',
        'firm.deliveryAddress,',
        'articleQuotationEntries',
      ),
    });
    if (quotation) {
      console.log(quotation);
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

      const pdfBuffer = await this.pdfService.generatePdf(data);
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
      queryOptions as FindOneOptions<ResponseQuotationDto>,
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
    //retrieve the currency informations
    await this.currencyService.findOneById(firm.currencyId);

    //save article entries
    const articleEntries =
      createQuotationDto.articleQuotationEntries &&
      (await this.articleQuotationEntryService.saveMany(
        createQuotationDto.articleQuotationEntries,
      ));

    // calculate the financial informations of the quotation
    const { subTotal, total } =
      InvoicingCalculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );

    // apply taxstamp and general discount
    const totalAfterGeneralDiscountAndTaxStamp =
      InvoicingCalculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        createQuotationDto.discount,
        createQuotationDto.discount_type,
        createQuotationDto.taxStamp || 0,
      );

    return this.quotationRepository.save({
      ...createQuotationDto,
      currencyId: firm.currencyId,
      articleQuotationEntries: articleEntries,
      subTotal: subTotal,
      total: totalAfterGeneralDiscountAndTaxStamp,
    });
  }

  async saveMany(
    createQuotationDtos: CreateQuotationDto[],
  ): Promise<QuotationEntity[]> {
    return this.quotationRepository.saveMany(createQuotationDtos);
  }

  async update(
    id: number,
    updateQuotationDto: UpdateQuotationDto,
  ): Promise<QuotationEntity> {
    //retrieve the quotation that have to be updated
    const existingQuotation = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'articleQuotationEntries',
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
      InvoicingCalculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => entry.total),
        articleEntries.map((entry) => entry.subTotal),
      );
    const totalAfterGeneralDiscountAndTaxStamp =
      InvoicingCalculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        updateQuotationDto.discount,
        updateQuotationDto.discount_type,
        updateQuotationDto.taxStamp || 0,
        //applying discount is set true by default
      );

    return this.quotationRepository.save({
      ...existingQuotation,
      ...updateQuotationDto,
      currencyId: firm.currencyId,
      articleQuotationEntries: articleEntries,
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
    return this.quotationRepository.getTotalCount({});
  }
}
