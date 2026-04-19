import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateArticlePurchaseQuotationEntryTaxDto {
  @ApiProperty({})
  taxId?: number;

  @ApiProperty({})
  @IsOptional()
  articlePurchaseQuotationEntryId?: number;
}
