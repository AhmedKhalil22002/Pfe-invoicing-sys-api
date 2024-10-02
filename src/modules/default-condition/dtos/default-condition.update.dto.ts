import { ApiProperty } from '@nestjs/swagger';
import { CreateDefaultConditionDto } from './default-condition.create.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDefaultConditionDto extends CreateDefaultConditionDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  propagate_changes: boolean;
}
