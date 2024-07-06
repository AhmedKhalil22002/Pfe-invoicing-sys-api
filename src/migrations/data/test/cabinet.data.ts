import { CreateCabinetDto } from 'src/modules/cabinet/dtos/cabinet.create.dto';

export const cabinet: CreateCabinetDto = {
  enterpriseName: 'Zedney Creative EMEA',
  email: 'contact@zedney.com',
  phone: '+216 72 428 365',
  taxIdNumber: '1538414/L/A/M/0000',
  activityId: 8,
  currencyId: 143,
  address: {
    address: '188 Avenue 14 Janvier',
    address2: 'Apt. 855',
    region: 'Bizerte',
    zipcode: '7000',
    countryId: 227,
  },
};
