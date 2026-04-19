import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional } from 'class-validator';
import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { ResponseArticleDto } from 'src/modules/article/dtos/article.response.dto';

export class ResponseArticlePurchaseInvoiceEntryDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ example: 100.0, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  unit_price?: number;

  @ApiProperty({ example: 2, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({ example: 10, type: Number, required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    example: DISCOUNT_TYPES.PERCENTAGE,
    enum: DISCOUNT_TYPES,
    required: false,
  })
  @IsOptional()
  @IsEnum(DISCOUNT_TYPES)
  discount_type?: DISCOUNT_TYPES;

  @ApiProperty({ type: () => ResponseArticleDto, required: false })
  @IsOptional()
  article?: ResponseArticleDto;

  @ApiProperty({ example: 1, type: Number, required: false })
  @IsOptional()
  @IsInt()
  purchaseInvoiceId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  articlePurchaseInvoiceEntryTaxes?: any[];
}
