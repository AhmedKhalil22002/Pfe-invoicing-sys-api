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
import { ArticleQuotationEntryTaxService } from './article-quotation-entry-tax.service';
import { TaxEntity } from 'src/modules/tax/repositories/entities/tax.entity';
import { ResponseArticleQuotationEntryDto } from '../dtos/article-quotation-entry.response.dto';

@Injectable()
export class ArticleQuotationEntryService {
  constructor(
    private readonly articleQuotationEntryRepository: ArticleQuotationEntryRepository,
    private readonly articleQuotationEntryTaxService: ArticleQuotationEntryTaxService,
    private readonly articleService: ArticleService,
    private readonly taxService: TaxService,
  ) {}

  private async getTaxes(
    articleQuotationEntryEntity: ArticleQuotationEntryEntity,
  ): Promise<TaxEntity[]> {
    const taxes = [];
    for (const taxEntry of articleQuotationEntryEntity.articleQuotationEntryTaxes) {
      taxes.push(await this.taxService.findOneById(taxEntry.tax.id));
    }
    return taxes;
  }

  async findOneById(id: number): Promise<ResponseArticleQuotationEntryDto> {
    const entry = await this.articleQuotationEntryRepository.findOneById(id);
    if (!entry) {
      throw new ArticleQuotationEntryNotFoundException();
    }
    return {
      ...entry,
      taxes: await this.getTaxes(entry),
    };
  }

  async save(
    createArticleQuotationEntryDto: CreateArticleQuotationEntryDto,
  ): Promise<ArticleQuotationEntryEntity> {
    const taxes = await Promise.all(
      createArticleQuotationEntryDto.taxes.map((tax) =>
        this.taxService.findOneById(tax.id),
      ),
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

    const entry = await this.articleQuotationEntryRepository.save({
      ...createArticleQuotationEntryDto,
      articleId: article.id,
      subTotal:
        InvoicingCalculationsService.calculateSubTotalForLineItem(lineItem),
      total: InvoicingCalculationsService.calculateTotalForLineItem(lineItem),
    });

    await this.articleQuotationEntryTaxService.saveMany(
      taxes.map((tax) => {
        return {
          articleQuotationEntry: entry,
          tax,
        };
      }),
    );
    return entry;
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
    //fetch exisiting entry
    const existingEntry =
      await this.articleQuotationEntryRepository.findOneById(id);
    this.articleQuotationEntryTaxService.softDeleteMany(
      existingEntry.articleQuotationEntryTaxes.map((taxEntry) => taxEntry.id),
    );

    //fetch and check the existance of all taxes
    const taxes = await Promise.all(
      updateArticleQuotationEntryDto.taxes.map((tax) =>
        this.taxService.findOneById(tax.id),
      ),
    );

    //delete all existing taxes and rebuild
    for (const taxEntry of existingEntry.articleQuotationEntryTaxes) {
      this.articleQuotationEntryTaxService.softDelete(taxEntry.id);
    }

    //save and check of articles existance , if a given article doesn't exist by name , it will be created
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

    //update the entry with the new data and save it
    const entry = await this.articleQuotationEntryRepository.save({
      ...existingEntry,
      ...updateArticleQuotationEntryDto,
      articleId: article.id,
    });
    //save the new tax entries for the article entry
    await this.articleQuotationEntryTaxService.saveMany(
      taxes.map((tax) => {
        return {
          articleQuotationEntry: entry,
          tax,
        };
      }),
    );
    return entry;
  }

  async softDelete(id: number): Promise<ArticleQuotationEntryEntity> {
    await this.findOneById(id);
    return this.articleQuotationEntryRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]): Promise<void> {
    for (const id in ids) {
      await this.softDelete(ids[id]);
    }
  }
}
