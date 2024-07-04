import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsUSTaxIdentificationNumber } from 'src/common/helper/decorators/IsUSTaxIdentificationNumber.decorator';
import { CreateAddressDto } from 'src/modules/address/dtos/address.create';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class CreateCabinetDto {
  @ApiProperty({ example: faker.company.name(), type: String })
  @IsNotEmpty()
  enterpriseName?: string;

  @ApiProperty({ example: faker.internet.email(), type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: faker.phone.number(), type: String })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: faker.finance.routingNumber(), type: String })
  @IsUSTaxIdentificationNumber()
  taxIdNumber?: string;

  @ApiProperty({ type: () => CreateAddressDto })
  address: CreateAddressDto;

  @ApiProperty({ example: 1, type: Number })
  activityId?: number;

  @ApiProperty({ example: 1, type: Number })
  currencyId?: number;
}
