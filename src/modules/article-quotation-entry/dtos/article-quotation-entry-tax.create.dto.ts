import { TaxEntity } from 'src/modules/tax/repositories/entities/tax.entity';
import { ArticleQuotationEntryEntity } from '../repositories/entities/article-quotation-entry.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleQuotationEntryTaxDto {
  @ApiProperty({})
  tax?: TaxEntity;

  @ApiProperty({})
  articleQuotationEntry?: ArticleQuotationEntryEntity;
}
