import { DATE_FORMATS } from 'src/app/enums/date-formats.enum';

export const sequential = [
  {
    name: 'quotation-sequence',
    value: {
      label: 'quotation',
      prefix: 'QUO',
      dynamic_sequence: DATE_FORMATS.YYYY_MM,
      next: 1,
    },
  },
  {
    name: 'invoice-sequence',
    value: {
      label: 'invoice',
      prefix: 'INV',
      dynamic_sequence: DATE_FORMATS.YYYY_MM,
      next: 1,
    },
  },
];
