import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/common/database/dtos/database.response.dto';

export class ResponseCountryDto extends ResponseDtoHelper {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ example: faker.location.country(), type: String })
  name: string;
}
