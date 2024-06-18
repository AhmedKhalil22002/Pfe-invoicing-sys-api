import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateTaxDto {
  @ApiProperty({ example: 'FODEC', type: String })
  @IsString()
  @MinLength(3)
  label: string;

  @ApiProperty({ example: '0.05', type: Number })
  @IsNumber()
  rate: number;

  @ApiProperty({ example: 'true', type: Boolean })
  @IsBoolean()
  isSpecial: boolean;
}
