import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { SocialTitles } from 'src/app/constants/social-titles.enum';

export class ResponseInterlocutorDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ example: SocialTitles.MR, enum: SocialTitles })
  title: SocialTitles;

  @ApiProperty({ example: faker.person.firstName(), type: String })
  name: string;

  @ApiProperty({ example: faker.person.lastName(), type: String })
  surname: string;

  @ApiProperty({ example: faker.phone.number(), type: String })
  phone: string;

  @ApiProperty({ example: faker.internet.email(), type: String })
  email: string;
}
