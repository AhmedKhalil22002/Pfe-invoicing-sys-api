import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseQuotationDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  @Expose()
  id: number;

  @ApiProperty({ enum: ['incoming', 'outgoing'] })
  @Expose()
  direction: 'incoming' | 'outgoing';

  @ApiProperty({ type: Date })
  @Expose()
  date: Date;

  @ApiProperty({ type: Date })
  @Expose()
  dueDate: Date;

  @ApiProperty({ type: String })
  @Expose()
  object: string;

  @ApiProperty({ type: String })
  @Expose()
  generalConditions: string;
}
