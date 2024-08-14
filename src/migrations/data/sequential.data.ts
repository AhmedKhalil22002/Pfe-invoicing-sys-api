import { DATE_FORMAT } from 'src/app/enums/date-formats.enum';

export const sequential = [
  {
    key: 'quotation-sequence',
    value: {
      label: 'quotation',
      prefix: 'QUO',
      dynamic_sequence: DATE_FORMAT.yyyy_MM,
      next: 1,
    },
  },
  {
    key: 'invoice-sequence',
    value: {
      label: 'invoice',
      prefix: 'INV',
      dynamic_sequence: DATE_FORMAT.yyyy_MM,
      next: 1,
    },
  },
];
