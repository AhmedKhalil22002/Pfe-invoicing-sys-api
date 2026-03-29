import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseCurrencyDto } from 'src/modules/currency/dtos/currency.response.dto';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseBankAccountDto extends ResponseDtoHelper {
  @ApiProperty({ example: faker.datatype.number() })
  @Expose()
  id: number;

  @ApiProperty({ example: faker.name.firstName() })
  @Expose()
  name: string;

  @ApiProperty({ example: faker.finance.bic() })
  @Expose()
  bic: string;

  @ApiProperty({ example: faker.finance.account(20) })
  @Expose()
  rib: string;

  @ApiProperty({ example: faker.finance.iban() })
  @Expose()
  iban: string;

  @ApiProperty({ type: String })
  @Expose()
  currencyId: number;

  @ApiProperty({ type: ResponseCurrencyDto })
  @Expose()
  @Type(() => ResponseCurrencyDto)
  currency: ResponseCurrencyDto;

  @ApiProperty({ example: faker.datatype.boolean() })
  @Expose()
  isMain: boolean;
}
