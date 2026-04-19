import { ApiProperty } from '@nestjs/swagger';
import { CreatePurchaseInvoiceUploadDto } from './purchase-invoice-upload.create.dto';

export class UpdatePurchaseInvoiceUploadDto extends CreatePurchaseInvoiceUploadDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;
}
