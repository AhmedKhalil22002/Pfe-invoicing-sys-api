import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dtos/address.create';
import { CreateInterlocutorDto } from 'src/modules/interlocutor/dtos/interlocutor.create.dto';

export class CreateFirmDto {
  @ApiProperty({ example: faker.company.name() })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    example: `https://www.${faker.company.name().replace(' ', '')}.com`,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @ApiProperty({ example: true, type: Boolean })
  @IsBoolean()
  @IsOptional()
  isPerson?: boolean;

  @ApiProperty({ example: faker.finance.routingNumber(), type: String })
  @IsString()
  @MinLength(9)
  taxIdNumber?: string;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @IsOptional()
  activityId?: number;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @IsOptional()
  currencyId?: number;

  @ApiProperty({ type: () => CreateAddressDto })
  deliveryAddress?: CreateAddressDto;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @IsOptional()
  deliveryAddressId?: number;

  @ApiProperty({ type: () => CreateAddressDto })
  invoicingAddress?: CreateAddressDto;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @IsOptional()
  invoicingAddressId?: number;

  @ApiProperty({ type: () => CreateInterlocutorDto })
  mainInterlocutor?: CreateInterlocutorDto;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @IsOptional()
  mainInterlocutorId?: number;

  @ApiProperty({ example: 1, nullable: true })
  @IsOptional()
  cabinetId?: number;
}
