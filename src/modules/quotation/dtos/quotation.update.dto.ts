import { ApiProperty } from '@nestjs/swagger';
import { CreateQuotationDto } from './quotation.create.dto';

export class UpdateQuotationDto extends CreateQuotationDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;
}
