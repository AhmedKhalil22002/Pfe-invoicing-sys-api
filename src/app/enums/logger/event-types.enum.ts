export enum EVENT_TYPE {
  //Auth
  USER_LOGIN = 'user-login',
  USER_REGISTER = 'user-register',

  //Firm
  FIRM_CREATED = 'firm_created',
  FIRM_UPDATED = 'firm_updated',
  FIRM_DELETED = 'firm_deleted',

  //interlocutor
  INTERLOCUTOR_CREATED = 'interlocutor_created',
  INTERLOCUTOR_UPDATED = 'interlocutor_updated',
  INTERLOCUTOR_DELETED = 'interlocutor_deleted',
  INTERLOCUTOR_PROMOTED = 'interlocutor_promoted',

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

  BANK_ACCOUNT_CREATED = 'bank_account_created',
  BANK_ACCOUNT_UPDATED = 'bank_account_updated',
  BANK_ACCOUNT_DELETED = 'bank_account_deleted',

  DEFAULT_CONDITION_CREATED = 'default_condition_created',
  DEFAULT_CONDITION_UPDATED = 'default_condition_updated',
  DEFAULT_CONDITION_MASS_UPDATED = 'default_conditions_updated',
  DEFAULT_CONDITION_DELETED = 'default_condition_deleted',
}
