import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database-v2/dtos/database.response.dto';

export class ResponseActivityDto extends ResponseDtoHelper {
  @ApiProperty({ example: 1, type: Number })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Service', type: String })
  @Expose()
  label: string;
}
