import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppConfigDto {
  @ApiProperty({ example: faker.database.engine(), type: Object })
  value: any;
}
