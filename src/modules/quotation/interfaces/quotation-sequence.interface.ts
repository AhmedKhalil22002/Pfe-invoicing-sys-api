import { DATE_FORMAT } from 'src/app/enums/date-formats.enum';

export interface QuotationSequence {
  prefix: string;
  dynamic_sequence: DATE_FORMAT;
  next: number;
}
