import { TaxEntity } from 'src/modules/tax/repositories/entities/tax.entity';
import { ArticleQuotationEntryEntity } from '../repositories/entities/article-quotation-entry.entity';

export class CreateArticleQuotationEntryTaxDto {
  tax?: TaxEntity;
  articleQuotationEntry?: ArticleQuotationEntryEntity;
}
