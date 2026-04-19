import { ApiProperty } from '@nestjs/swagger';

export class ResponsePurchaseQuotationUploadDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  purchaseQuotationId?: number;

  @ApiProperty({
    example: 1,
    type: Number,
  })
  uploadId?: number;
}
