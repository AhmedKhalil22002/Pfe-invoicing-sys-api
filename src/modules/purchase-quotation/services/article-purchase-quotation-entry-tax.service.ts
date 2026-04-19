import { Injectable } from '@nestjs/common';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { CreateArticlePurchaseQuotationEntryTaxDto } from '../dtos/article-purchase-quotation-entry-tax.create.dto';
import { ArticlePurchaseQuotationEntryTaxEntity } from '../entities/article-purchase-quotation-entry-tax.entity';
import { ArticlePurchaseQuotationEntryTaxRepository } from '../repositories/article-purchase-quotation-entry-tax.repository';

@Injectable()
export class ArticlePurchaseQuotationEntryTaxService {
  constructor(
    private readonly articlePurchaseQuotationEntryTaxRepository: ArticlePurchaseQuotationEntryTaxRepository,
    private readonly taxService: TaxService,
  ) {}

  async save(
    createArticlePurchaseQuotationEntryTaxDto: CreateArticlePurchaseQuotationEntryTaxDto,
  ): Promise<ArticlePurchaseQuotationEntryTaxEntity> {
    const tax = await this.taxService.findOneById(
      createArticlePurchaseQuotationEntryTaxDto.taxId,
    );
    const taxEntry = await this.articlePurchaseQuotationEntryTaxRepository.save({
      articlePurchaseQuotationEntryId:
        createArticlePurchaseQuotationEntryTaxDto.articlePurchaseQuotationEntryId,
      tax,
    });
    return taxEntry;
  }

  async saveMany(
    createArticlePurchaseQuotationEntryTaxDtos: CreateArticlePurchaseQuotationEntryTaxDto[],
  ): Promise<ArticlePurchaseQuotationEntryTaxEntity[]> {
    const savedEntries = [];
    for (const dto of createArticlePurchaseQuotationEntryTaxDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async softDelete(id: number): Promise<void> {
    await this.articlePurchaseQuotationEntryTaxRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]): Promise<void> {
    ids.forEach(async (id) => await this.softDelete(id));
  }
}
