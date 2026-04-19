import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseInvoiceUploadDto {
  @ApiProperty({
    example: 1,
    type: Number,
  })
  uploadId?: number;
}
