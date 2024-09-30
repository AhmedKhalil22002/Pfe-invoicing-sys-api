import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateFirmInterlocutorEntryDto {
  @ApiProperty({ example: false, type: Boolean, required: false })
  @IsOptional()
  isMain?: boolean;

  @ApiProperty({ example: 'CEO', type: String, required: false })
  @IsOptional()
  @IsString()
  position?: string;
}
