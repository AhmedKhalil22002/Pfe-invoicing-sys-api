import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateQuotationDto {
  @ApiProperty({ enum: ['incoming', 'outgoing'] })
  @IsEnum(['incoming', 'outgoing'])
  direction: 'incoming' | 'outgoing';

  @ApiProperty({ type: Date })
  @IsDateString()
  date: Date;

  @ApiProperty({ type: Date })
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ type: String })
  @IsString()
  object: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  generalConditions?: string;
}
