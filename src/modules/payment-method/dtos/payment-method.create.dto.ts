import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 1, type: Number })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: faker.finance.transactionType(), type: String })
  @IsString()
  @MinLength(3)
  label: string;
}
