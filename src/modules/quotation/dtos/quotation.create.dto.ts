import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateQuotationDto {
  @ApiProperty({ example: faker.date.anytime(), type: Date })
  @IsOptional()
  @IsDate()
  date?: Date;

  @ApiProperty({ example: faker.date.anytime(), type: Date })
  @IsOptional()
  @IsDate()
  dueDate?: Date;

  @ApiProperty({
    example: faker.finance.transactionDescription(),
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  object?: string;

  @ApiProperty({
    example: faker.hacker.phrase(),
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  generalConditions?: string;

  @ApiProperty({
    example: 'enum will be inserted here',
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @ApiProperty({
    example: '0.1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  discount?: number;

  @ApiProperty({
    example: '125.35',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  subTotal?: number;

  @ApiProperty({
    example: '150.0',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  total?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  currencyId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  firmId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  interlocutorId?: number;
}
