import { Injectable } from '@nestjs/common';
import { ArticleQuotationEntryRepository } from '../repositories/repository/article-quotation-entry.repository';
import { ArticleQuotationEntryEntity } from '../repositories/entities/article-quotation-entry.entity';
import { ArticleQuotationEntryNotFoundException } from '../errors/article-quotation-entry.notfound.error';
import { CreateArticleQuotationEntryDto } from '../dtos/article-quotation-entry.create.dto';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { ArticleService } from 'src/modules/article/services/article.service';
import { ResponseArticleDto } from 'src/modules/article/dtos/article.response.dto';
import { UpdateArticleQuotationEntryDto } from '../dtos/article-quotation-entry.update.dto';
import { InvoicingCalculationsService } from 'src/common/calculations/services/invoicing.calculations.service';

@Injectable()
export class ArticleQuotationEntryService {
  constructor(
    private readonly articleQuotationEntryRepository: ArticleQuotationEntryRepository,
    private readonly articleService: ArticleService,
    private readonly taxService: TaxService,
  ) {}

  async findOneById(id: number): Promise<ArticleQuotationEntryEntity> {
    const entry = await this.articleQuotationEntryRepository.findOneById(id);
    if (!entry) {
      throw new ArticleQuotationEntryNotFoundException();
    }
    return entry;
  }

  async save(
    createArticleQuotationEntryDto: CreateArticleQuotationEntryDto,
  ): Promise<ArticleQuotationEntryEntity> {
    const taxes = createArticleQuotationEntryDto.taxes.map((tax) =>
      this.taxService.findOneById(tax.id),
    );
    let article: ResponseArticleDto;

    article = await this.articleService.findOneByCondition({
      filters: { title: createArticleQuotationEntryDto.article.title },
    });
    if (!article)
      article = await this.articleService.save(
        createArticleQuotationEntryDto.article,
      );

    const lineItem = {
      quantity: createArticleQuotationEntryDto.quantity,
      unit_price: createArticleQuotationEntryDto.unit_price,
      discount: createArticleQuotationEntryDto.discount,
      discount_type: createArticleQuotationEntryDto.discount_type,
      taxes: createArticleQuotationEntryDto.taxes,
    };

    return this.articleQuotationEntryRepository.save({
      ...createArticleQuotationEntryDto,
      taxes: await Promise.all(taxes),
      articleId: article.id,
      subTotal:
        InvoicingCalculationsService.calculateSubTotalForLineItem(lineItem),
      total:
        InvoicingCalculationsService.calculateSubTotalForLineItem(lineItem),
    });
  }

  async saveMany(
    createArticleQuotationEntryDtos: CreateArticleQuotationEntryDto[],
  ): Promise<ArticleQuotationEntryEntity[]> {
    const savedEntries = [];
    for (const dto of createArticleQuotationEntryDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async update(
    id: number,
    updateArticleQuotationEntryDto: UpdateArticleQuotationEntryDto,
  ): Promise<ArticleQuotationEntryEntity> {
    const existingEntry = await this.findOneById(id);
    const taxes = updateArticleQuotationEntryDto.taxes.map((tax) =>
      this.taxService.findOneById(tax.id),
    );
    let article: ResponseArticleDto;
    try {
      article = await this.articleService.findOneByCondition({
        filters: { title: updateArticleQuotationEntryDto.article.title },
      });
    } catch (error) {
      article = await this.articleService.save(
        updateArticleQuotationEntryDto.article,
      );
    }

    return this.articleQuotationEntryRepository.save({
      ...existingEntry,
      ...updateArticleQuotationEntryDto,
      taxes: await Promise.all(taxes),
      articleId: article.id,
    });
  }

  async softDelete(id: number): Promise<ArticleQuotationEntryEntity> {
    await this.findOneById(id);
    return this.articleQuotationEntryRepository.softDelete(id);
  }
}
