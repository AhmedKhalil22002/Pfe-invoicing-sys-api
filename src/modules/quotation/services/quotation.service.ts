import { Injectable } from '@nestjs/common';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
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
import { ArticleQuotationEntryService } from 'src/modules/article-quotation-entry/services/article-quotation-entry.service';
import { InvoicingCalculationsService } from 'src/common/calculations/services/invoicing.calculations.service';
import { getSelectAndRelations } from 'src/common/database/utils/selectAndRelations';
import { ArticleQuotationEntryEntity } from 'src/modules/article-quotation-entry/repositories/entities/article-quotation-entry.entity';

@Injectable()
export class QuotationService {
  constructor(
    private readonly quotationRepository: QuotationRepository,
    private readonly currencyService: CurrencyService,
    private readonly articleQuotationEntryService: ArticleQuotationEntryService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
  ) {}

  async findOneById(id: number): Promise<ResponseQuotationDto> {
    const quotation = await this.quotationRepository.findOneById(id);
    if (!quotation) {
      throw new QuotationNotFoundException();
    }
    return {
      ...quotation,
      articles: await Promise.all(
        quotation.articles.map((entry) =>
          this.articleQuotationEntryService.findOneById(entry.id),
        ),
      ),
    };
  }

  async findOneByCondition(
    options: QueryOptions<QuotationEntity>,
  ): Promise<ResponseQuotationDto | null> {
    const { select, relations } = getSelectAndRelations(
      await this.quotationRepository.getRelatedEntityNames(),
      options,
    );
    const where = buildWhereClause<QuotationEntity>(
      options.filters,
      options.strictMatching,
    );
    const quotation = await this.quotationRepository.findByCondition({
      select,
      relations,
      where: { ...where, deletedAt: null },
    });
    if (!quotation) return null;
    return {
      ...quotation,
      articles: await Promise.all(
        quotation.articles.map((entry) =>
          this.articleQuotationEntryService.findOneById(entry.id),
        ),
      ),
    };
  }

  async findAll(): Promise<QuotationEntity[]> {
    return await this.quotationRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseQuotationDto>,
  ): Promise<PageDto<QuotationEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;
    const where = buildWhereClause(filters, strictMatching);
    const count = await this.quotationRepository.getTotalCount({ where });
    const entities = await this.quotationRepository.findAll({
      ...(Object.keys(options?.columns || {}).length > 0
        ? { select: options.columns }
        : {}),
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
      relations: {
        interlocutor: true,
        firm: true,
        currency: true,
      },
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async save(createQuotationDto: CreateQuotationDto): Promise<QuotationEntity> {
    //fetch the firm in order to check its existance and later get its currency
    const firm = await this.firmService.findOneByCondition({
      filters: { id: createQuotationDto.firmId },
      relationSelect: true,
    });
    //fetch the interlocutor in order to check its existance
    await this.interlocutorService.findOneById(
      createQuotationDto.interlocutorId,
    );
    //retrieve the currency informations
    await this.currencyService.findOneById(firm.currencyId);

    //save article entries
    const articleEntries: ArticleQuotationEntryEntity[] =
      await this.articleQuotationEntryService.saveMany(
        createQuotationDto.articles,
      );

    // calculate the financial informations of the quotation
    const { subTotal, total } =
      InvoicingCalculationsService.calculateLineItemsTotal(
        createQuotationDto.articles.map((entry) => {
          return {
            quantity: entry.quantity,
            unit_price: entry.unit_price,
            discount: entry.discount,
            discount_type: entry.discount_type,
            taxes: entry.taxes,
          };
        }),
      );
    return this.quotationRepository.save({
      ...createQuotationDto,
      currencyId: firm.currencyId,
      articles: articleEntries,
      subTotal: subTotal,
      total: InvoicingCalculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        createQuotationDto.discount,
        createQuotationDto.discount_type,
        createQuotationDto.taxStamp || 0,
        //applying discount is set true by default
      ),
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
    console.log(id);
    //retrieve the quotation that have to be updated
    const existingQuotation = await this.quotationRepository.findOneById(id);
    //fetch the firm in order to check its existance and later get its currency
    const firm = await this.firmService.findOneByCondition({
      filters: { id: updateQuotationDto.firmId },
      relationSelect: true,
    });
    //fetch the interlocutor in order to check its existance
    await this.interlocutorService.findOneById(
      updateQuotationDto.interlocutorId,
    );
    //retrieve the currency informations
    await this.currencyService.findOneById(firm.currencyId);

    //perform soft delete for old entries
    this.articleQuotationEntryService.softDeleteMany(
      existingQuotation.articles.map((entry) => entry.id),
    );

    //save article entries
    const articleEntries: ArticleQuotationEntryEntity[] =
      await this.articleQuotationEntryService.saveMany(
        updateQuotationDto.articles,
      );
    console.log(articleEntries);
    // calculate the financial informations of the quotation
    const { subTotal, total } =
      InvoicingCalculationsService.calculateLineItemsTotal(
        updateQuotationDto.articles.map((entry) => {
          return {
            quantity: entry.quantity,
            unit_price: entry.unit_price,
            discount: entry.discount,
            discount_type: entry.discount_type,
            taxes: entry.taxes,
          };
        }),
      );
    return this.quotationRepository.save({
      ...existingQuotation,
      ...updateQuotationDto,
      currencyId: firm.currencyId,
      articles: articleEntries,
      subTotal: subTotal,
      total: InvoicingCalculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        updateQuotationDto.discount,
        updateQuotationDto.discount_type,
        updateQuotationDto.taxStamp || 0,
        //applying discount is set true by default
      ),
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
