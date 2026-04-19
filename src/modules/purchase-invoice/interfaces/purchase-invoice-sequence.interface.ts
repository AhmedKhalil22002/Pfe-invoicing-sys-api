import { DateFormat } from 'src/modules/sequence/enums/date-format.enum';

export interface PurchaseInvoiceSequence {
  prefix: string;
  dateFormat: DateFormat;
  next: number;
}
