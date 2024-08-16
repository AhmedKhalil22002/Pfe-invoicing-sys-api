import { DATE_FORMAT } from 'src/app/enums/date-formats.enum';

export const sequential = [
  {
    key: 'quotation_sequence',
    value: {
      label: 'quotation',
      prefix: 'QUO',
      dynamicSequence: DATE_FORMAT.yyyy_MM,
      next: 1,
    },
  },
  {
    key: 'invoice_sequence',
    value: {
      label: 'invoice',
      prefix: 'INV',
      dynamicSequence: DATE_FORMAT.yyyy_MM,
      next: 1,
    },
  },
];
