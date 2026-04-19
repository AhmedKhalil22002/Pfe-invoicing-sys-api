import { ApiProperty } from '@nestjs/swagger';
import { CreatePurchaseQuotationUploadDto } from './purchase-quotation-upload.create.dto';

export class UpdatePurchaseQuotationUploadDto extends CreatePurchaseQuotationUploadDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;
}
