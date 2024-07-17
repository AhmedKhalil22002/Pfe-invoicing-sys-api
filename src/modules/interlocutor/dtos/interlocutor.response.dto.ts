import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { SOCIAL_TITLES } from 'src/app/enums/social-titles.enum';
import { ResponseFirmDto } from 'src/modules/firm/dtos/firm.response.dto';

export class ResponseInterlocutorDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ example: SOCIAL_TITLES.MR, enum: SOCIAL_TITLES })
  title: SOCIAL_TITLES;

  @ApiProperty({ example: faker.person.firstName(), type: String })
  name: string;

  @ApiProperty({ example: faker.person.lastName(), type: String })
  surname: string;

  @ApiProperty({ example: faker.phone.number(), type: String })
  phone: string;

  @ApiProperty({ example: faker.internet.email(), type: String })
  email: string;

  @ApiProperty({ type: Array })
  firms: ResponseFirmDto[];

  @ApiProperty({ type: Array })
  mainFirms: ResponseFirmDto[];
}
