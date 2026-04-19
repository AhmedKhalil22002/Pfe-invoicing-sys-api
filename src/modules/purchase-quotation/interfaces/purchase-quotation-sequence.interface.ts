import { DateFormat } from 'src/modules/sequence/enums/date-format.enum';

export interface PurchaseQuotationSequence {
  prefix: string;
  dateFormat: DateFormat;
  next: number;
}
