import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { SocialTitles } from 'src/app/constants/social-titles.enum';

export class CreateInterlocutorDto {
  @ApiProperty({ example: SocialTitles.MR, enum: SocialTitles })
  @IsOptional()
  @IsEnum(SocialTitles)
  title: SocialTitles;

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
