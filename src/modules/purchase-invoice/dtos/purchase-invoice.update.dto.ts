import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreatePurchaseInvoiceDto } from './purchase-invoice.create.dto';
import { UpdatePurchaseInvoiceUploadDto } from './purchase-invoice-upload.update.dto';

export class UpdatePurchaseInvoiceDto extends CreatePurchaseInvoiceDto {
  @ApiProperty({ required: false })
  @IsOptional()
  uploads?: UpdatePurchaseInvoiceUploadDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  amountPaid: number;
}
