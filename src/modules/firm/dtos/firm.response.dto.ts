import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/common/database/dtos/database.response.dto';
import { ActivityEntity } from 'src/modules/activity/repositories/entities/activity.entity';
import { AddressEntity } from 'src/modules/address/repositories/entities/address.entity';
import { CurrencyEntity } from 'src/modules/currency/repositories/entities/currency.entity';

export class FirmResponseDto extends ResponseDtoHelper {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: faker.company.name() })
  companyName: string;

  @ApiProperty({
    example: `https://www.${faker.company.name()}.com`,
    type: String,
  })
  website?: string;

  @ApiProperty({ example: true })
  isCompany: boolean;

  @ApiProperty({ example: faker.finance.routingNumber(), type: String })
  taxIdNumber?: string;

  @ApiProperty({ type: () => ActivityEntity, nullable: true })
  activity?: ActivityEntity;

  @ApiProperty({ example: 1, nullable: true })
  activityId?: number;

  @ApiProperty({ type: () => CurrencyEntity, nullable: true })
  currency?: CurrencyEntity;

  @ApiProperty({ example: 1, nullable: true })
  currencyId?: number;

  @ApiProperty({ type: () => AddressEntity, nullable: true })
  invoicingAddress?: AddressEntity;

  @ApiProperty({ example: 1, nullable: true })
  invoicingAddressId?: number;

  @ApiProperty({ type: () => AddressEntity, nullable: true })
  deliveryAddress?: AddressEntity;

  @ApiProperty({ example: 1, nullable: true })
  deliveryAddressId?: number;
}
