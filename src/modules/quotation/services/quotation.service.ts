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
import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';

@Injectable()
export class QuotationService {
  constructor(
    private readonly quotationRepository: QuotationRepository,
    private readonly currencyService: CurrencyService,
    private readonly articleQuotationEntryService: ArticleQuotationEntryService,
    private readonly firmService: FirmService,
    private readonly interlocutorService: InterlocutorService,
  ) {}

  async findOneById(id: number): Promise<QuotationEntity> {
    const quotation = await this.quotationRepository.findOneById(id);
    if (!quotation) {
      throw new QuotationNotFoundException();
    }
    return quotation;
  }

  async findOneByCondition(
    options: QueryOptions<ResponseQuotationDto>,
  ): Promise<QuotationEntity | null> {
    const quotation = await this.quotationRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!quotation) return null;
    return quotation;
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
    console.log(createQuotationDto.articles);
    const firm = await this.firmService.findOneByCondition({
      filters: { id: createQuotationDto.firmId },
      relationSelect: true,
    });
    await this.interlocutorService.findOneById(
      createQuotationDto.interlocutorId,
    );

    await this.currencyService.findOneById(firm.currencyId);

    const articleEntries = await this.articleQuotationEntryService.saveMany(
      createQuotationDto.articles,
    );

    const { subTotal, total } =
      InvoicingCalculationsService.calculateLineItemsTotal(
        articleEntries.map((entry) => ({
          quantity: entry.quantity,
          unit_price: entry.unit_price,
          discount: entry.discount,
          discount_type:
            entry.discount_type == DISCOUNT_TYPES.PERCENTAGE
              ? 'percentage'
              : 'amount',
          taxes: entry.taxes.map((tax) => ({
            rate: tax.rate,
          })),
        })),
      );
    console.log(
      'im here',
      subTotal,
      total,
      InvoicingCalculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        createQuotationDto.discount,
        createQuotationDto.discount_type,
        createQuotationDto.taxStamp || 0,
        true,
      ),
    );
    return this.quotationRepository.save({
      ...createQuotationDto,
      firmId: createQuotationDto.firmId,
      currencyId: firm.currencyId,
      articles: articleEntries,
      subTotal: subTotal,
      total: InvoicingCalculationsService.calculateTotalDiscountAndTaxStamp(
        total,
        createQuotationDto.discount,
        createQuotationDto.discount_type,
        createQuotationDto.taxStamp || 0,
        true,
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
    const quotation = await this.findOneById(id);
    return this.quotationRepository.save({
      ...quotation,
      ...updateQuotationDto,
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
