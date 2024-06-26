import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, MinLength } from 'class-validator';

export class CreatePaymentConditionDto {
  @ApiProperty({ example: faker.finance.transactionType(), type: String })
  @IsString()
  @MinLength(3)
  label: string;

  @ApiProperty({
    example: faker.definitions.company.descriptor[0],
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: faker.definitions.company.descriptor[0],
    type: Boolean,
    default: false,
  })
  @IsBoolean()
  isDeletionRestricted: boolean;
}
