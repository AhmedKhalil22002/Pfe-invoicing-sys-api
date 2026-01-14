import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RequestRegisterDto {
  @ApiProperty({
    type: String,
    example: faker.internet.email(),
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    example: faker.internet.email(),
  })
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @ApiProperty({ type: String, example: 'password123' })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
