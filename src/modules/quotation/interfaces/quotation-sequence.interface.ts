import { DateFormat } from 'src/modules/sequence/enums/date-format.enum';

export interface QuotationSequence {
  prefix: string;
  DateFormat: DateFormat;
  next: number;
}
