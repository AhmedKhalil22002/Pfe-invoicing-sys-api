import { ApiProperty } from '@nestjs/swagger';
import { ResponsePurchaseInvoiceDto } from './purchase-invoice.response.dto';

export class ResponsePurchaseInvoiceRangeDto {
  @ApiProperty({ type: ResponsePurchaseInvoiceDto })
  next: ResponsePurchaseInvoiceDto;

  @ApiProperty({ type: ResponsePurchaseInvoiceDto })
  previous: ResponsePurchaseInvoiceDto;
}
