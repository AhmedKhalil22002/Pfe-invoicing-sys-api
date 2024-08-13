import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateAppConfigDto {
  @ApiProperty({ example: faker.database.engine(), type: String })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: faker.database.engine(), type: Object })
  value: any;
}
