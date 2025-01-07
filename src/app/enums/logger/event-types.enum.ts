export enum EVENT_TYPE {
  //Auth
  USER_LOGIN = 'user-login',
  USER_REGISTER = 'user-register',

  //Firm
  FIRM_CREATED = 'firm_created',
  FIRM_UPDATED = 'firm_updated',
  FIRM_DELETED = 'firm_deleted',

  //Selling Quotation
  SELLING_QUOTATION_CREATED = 'quotation_created',
  SELLING_QUOTATION_UPDATED = 'quotation_updated',
  SELLING_QUOTATION_DELETED = 'quotation_deleted',
  SELLING_QUOTATION_SENT = 'quotation_sent',
  SELLING_QUOTATION_PAID = 'quotation_paid',
  SELLING_QUOTATION_OVERDUE = 'quotation_overdue',
  SELLING_QUOTATION_CANCELED = 'quotation_canceled',

  //Selling Invoice
  SELLING_INVOICE_CREATED = 'invoice_created',
  SELLING_INVOICE_UPDATED = 'invoice_updated',
  SELLING_INVOICE_DELETED = 'invoice_deleted',
  SELLING_INVOICE_SENT = 'invoice_sent',
  SELLING_INVOICE_PAID = 'invoice_paid',
  SELLING_INVOICE_OVERDUE = 'invoice_overdue',
  SELLING_INVOICE_CANCELED = 'invoice_canceled',

  //Content
  ACTIVITY_CREATED = 'activity_created',
  ACTIVITY_UPDATED = 'activity_updated',
  ACTIVITY_DELETED = 'activity_deleted',
}
