import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 1, type: Number })
  @IsNotEmpty()
  @IsInt()
  id: number;

  @ApiProperty({ example: faker.location.country, type: String })
  @IsString()
  @MinLength(3)
  name: string;
}
