import { Injectable } from '@nestjs/common';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { ArticlePurchaseInvoiceEntryTaxRepository } from '../repositories/article-purchase-invoice-entry-tax.repository';
import { ArticlePurchaseInvoiceEntryTaxEntity } from '../entities/article-purchase-invoice-entry-tax.entity';
import { CreateArticlePurchaseInvoiceEntryTaxDto } from '../dtos/article-purchase-invoice-entry-tax.create.dto';

@Injectable()
export class ArticlePurchaseInvoiceEntryTaxService {
  constructor(
    private readonly articlePurchaseInvoiceEntryTaxRepository: ArticlePurchaseInvoiceEntryTaxRepository,
    private readonly taxService: TaxService,
  ) {}

  async save(
    createArticlePurchaseInvoiceEntryTaxDto: CreateArticlePurchaseInvoiceEntryTaxDto,
  ): Promise<ArticlePurchaseInvoiceEntryTaxEntity> {
    const tax = await this.taxService.findOneById(
      createArticlePurchaseInvoiceEntryTaxDto.taxId,
    );
    const taxEntry = await this.articlePurchaseInvoiceEntryTaxRepository.save({
      articlePurchaseInvoiceEntryId:
        createArticlePurchaseInvoiceEntryTaxDto.articlePurchaseInvoiceEntryId,
      tax,
    });
    return taxEntry;
  }

  async saveMany(
    createArticlePurchaseInvoiceEntryTaxDtos: CreateArticlePurchaseInvoiceEntryTaxDto[],
  ): Promise<ArticlePurchaseInvoiceEntryTaxEntity[]> {
    const savedEntries = [];
    for (const dto of createArticlePurchaseInvoiceEntryTaxDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async softDelete(id: number): Promise<void> {
    await this.articlePurchaseInvoiceEntryTaxRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.softDelete(id);
    }
  }
}
