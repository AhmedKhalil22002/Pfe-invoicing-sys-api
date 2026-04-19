export enum PURCHASE_INVOICE_STATUS {
  Nonexistent = 'purchase_invoice.status.non_existent',
  Draft = 'purchase_invoice.status.draft',
  Sent = 'purchase_invoice.status.sent',
  Validated = 'purchase_invoice.status.validated',
  Paid = 'purchase_invoice.status.paid',
  PartiallyPaid = 'purchase_invoice.status.partially_paid',
  Unpaid = 'purchase_invoice.status.unpaid',
  Expired = 'purchase_invoice.status.expired',
  Archived = 'purchase_invoice.status.archived',
}
