import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: faker.location.country, type: String })
  @IsString()
  @MinLength(3)
  name: string;
}
