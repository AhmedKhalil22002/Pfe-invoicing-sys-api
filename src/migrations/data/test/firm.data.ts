import { SOCIAL_TITLES } from 'src/app/enums/social-titles.enum';
import { CreateFirmDto } from 'src/modules/firm/dtos/firm.create.dto';

export const firms: CreateFirmDto[] = [
  {
    activityId: 2,
    currencyId: 63,
    isPerson: false,
    name: 'Blaine Franks',
    notes: 'Laboris labore digni',
    paymentConditionId: 3,
    taxIdNumber: '124-25-6552',
    website: 'https://www.beroxywy.org.uk',
    deliveryAddress: {
      address: 'Optio voluptatum ne',
      address2: 'Molestiae elit illu',
      countryId: 111,
      region: 'Dolore ut maiores se',
      zipcode: '91453',
    },

    invoicingAddress: {
      address: 'Odit eos excepturi e',
      address2: 'Aut aperiam labore h',
      countryId: 148,
      region: 'Nihil facere facilis',
      zipcode: '15776',
    },
    mainInterlocutorId: 1,
    mainInterlocutor: {
      email: 'qujobotim@mailinator.com',
      name: 'Nash Ward',
      phone: '+1 (448) 422-7272',
      surname: 'Johnson',
      title: SOCIAL_TITLES.DR,
    },
  },
];
