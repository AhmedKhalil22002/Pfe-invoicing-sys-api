import { Injectable } from '@nestjs/common';
import { ArticleQuotationEntryTaxRepository } from '../repositories/repository/article-quotation-entry-tax.repository';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { CreateArticleQuotationEntryTaxDto } from '../dtos/article-quotation-entry-tax.create.dto';
import { ArticleQuotationEntryTaxEntity } from '../repositories/entities/article-quotation-entry-tax.entity';

@Injectable()
export class ArticleQuotationEntryTaxService {
  constructor(
    private readonly articleQuotationEntryTaxRepository: ArticleQuotationEntryTaxRepository,
    private readonly taxService: TaxService,
  ) {}

  async save(
    createArticleQuotationEntryTaxDto: CreateArticleQuotationEntryTaxDto,
  ): Promise<ArticleQuotationEntryTaxEntity> {
    const tax = await this.taxService.findOneById(
      createArticleQuotationEntryTaxDto.tax.id,
    );
    const taxEntry = await this.articleQuotationEntryTaxRepository.save({
      articleQuotationEntry:
        createArticleQuotationEntryTaxDto.articleQuotationEntry,
      tax,
    });
    return taxEntry;
  }

  async saveMany(
    createArticleQuotationEntryTaxDtos: CreateArticleQuotationEntryTaxDto[],
  ): Promise<ArticleQuotationEntryTaxEntity[]> {
    const savedEntries = [];
    for (const dto of createArticleQuotationEntryTaxDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async softDelete(id: number): Promise<void> {
    await this.articleQuotationEntryTaxRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]): Promise<void> {
    for (const id in ids) {
      await this.softDelete(ids[id]);
    }
  }
}
