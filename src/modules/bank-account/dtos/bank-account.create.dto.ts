import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBIC,
  IsBoolean,
  IsIBAN,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateBankAccountDto {
  @ApiProperty({ example: faker.name.firstName() })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: faker.finance.bic() })
  @IsBIC()
  bic: string;

  @ApiProperty({ example: faker.finance.account(20) })
  @IsString()
  @MaxLength(20)
  rib: string;

  @ApiProperty({ example: faker.finance.iban() })
  @IsIBAN()
  iban: string;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  currencyId: number;

  @ApiProperty({ example: faker.datatype.boolean() })
  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}
