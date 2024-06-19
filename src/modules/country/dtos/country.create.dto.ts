import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 1, type: Number })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ example: faker.location.country, type: String })
  @IsString()
  @MinLength(3)
  name: string;
}
