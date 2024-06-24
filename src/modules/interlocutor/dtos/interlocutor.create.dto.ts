import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateInterlocutorDto {
  @ApiProperty({ example: faker.person.firstName(), type: String })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: faker.person.lastName(), type: String })
  @IsString()
  @MinLength(3)
  surname: string;

  @ApiProperty({ example: faker.phone.number(), type: String })
  @IsString()
  phone: string;

  @ApiProperty({ example: faker.internet.email(), type: String })
  @IsString()
  email: string;
}
