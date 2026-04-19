import { ApiProperty } from '@nestjs/swagger';

export class ResponsePurchaseInvoiceUploadDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  purchaseInvoiceId?: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  uploadId?: number;
}
