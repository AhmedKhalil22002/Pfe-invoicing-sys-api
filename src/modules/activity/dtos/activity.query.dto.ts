import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { QueryDtoHelper } from 'src/common/database/dtos/database.query.dto';

export class QueryActivityDto extends QueryDtoHelper {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(3)
  label: string;
}
