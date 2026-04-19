import { ApiProperty } from '@nestjs/swagger';
import { ResponseTaxDto } from 'src/modules/tax/dtos/tax.response.dto';

export class CreateArticlePurchaseQuotationEntryTaxDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ example: 1, type: Number })
  articlePurchaseQuotationEntryId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  taxId?: number;

  @ApiProperty({ type: () => ResponseTaxDto })
  tax?: ResponseTaxDto;
}
