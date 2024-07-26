import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { QUOTATION_STATUS } from 'src/modules/quotation/enums/quotation-status.enum';

export const quotations = [
  {
    date: new Date('2023-07-01T12:00:00Z'),
    dueDate: new Date('2023-07-15T12:00:00Z'),
    object: 'Payment for the supply of office equipment',
    generalConditions: 'Payment must be made within 30 days',
    status: QUOTATION_STATUS.Draft,
    discount: 0.1,
    discount_type: DISCOUNT_TYPES.PERCENTAGE,
    subTotal: 125.35,
    total: 150.0,
    currencyId: 1,
    firmId: 1,
    interlocutorId: 1,
  },
];
