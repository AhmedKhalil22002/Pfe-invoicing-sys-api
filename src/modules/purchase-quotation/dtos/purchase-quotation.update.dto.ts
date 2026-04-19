import { ApiProperty } from '@nestjs/swagger';
import { UpdatePurchaseQuotationUploadDto } from './purchase-quotation-upload.update.dto';
import { IsOptional } from 'class-validator';
import { CreatePurchaseQuotationDto } from './purchase-quotation.create.dto';

export class UpdatePurchaseQuotationDto extends CreatePurchaseQuotationDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  uploads?: UpdatePurchaseQuotationUploadDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  createInvoice: boolean;
}
