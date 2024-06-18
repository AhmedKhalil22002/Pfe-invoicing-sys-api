import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MinLength,
} from 'class-validator';

export class CreateTaxDto {
  @ApiProperty({ example: 'FODEC', type: String })
  @IsString()
  @MinLength(3)
  label: string;

  @ApiProperty({ example: '0.05', type: Number })
  @IsNumber()
  @IsPositive()
  @Max(1)
  rate: number;

  @ApiProperty({ example: 'true', type: Boolean })
  @IsBoolean()
  isSpecial: boolean;
}
