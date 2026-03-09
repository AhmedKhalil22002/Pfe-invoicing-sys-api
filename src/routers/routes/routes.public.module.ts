import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/shared/app-config/app-config.module';
import { AppConfigController } from 'src/shared/app-config/controllers/app-config.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivityController } from 'src/modules/activity/controllers/activity.controller';
import { AddressModule } from 'src/modules/address/address.module';
import { AddressController } from 'src/modules/address/controllers/address.controller';
import { ArticleModule } from 'src/modules/article/article.module';
import { ArticleController } from 'src/modules/article/controllers/article.controller';
import { BankAccountModule } from 'src/modules/bank-account/bank-account.module';
import { BankAccountController } from 'src/modules/bank-account/controllers/bank-account.controller';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { CabinetController } from 'src/modules/cabinet/controllers/cabinet.controller';
import { CountryController } from 'src/modules/country/controllers/country.controller';
import { CountryModule } from 'src/modules/country/country.module';
import { CurrencyController } from 'src/modules/currency/controllers/currency.controller';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { DefaultConditionController } from 'src/modules/default-condition/controllers/default-condition.controller';
import { DefaultConditionModule } from 'src/modules/default-condition/default-condition.module';
import { FirmInterlocutorEntryController } from 'src/modules/firm-interlocutor-entry/controllers/firm-interlocutor-entry.controller.ts';
import { FirmInterlocutorEntryModule } from 'src/modules/firm-interlocutor-entry/firm-interlocutor-entry.module';
import { FirmController } from 'src/modules/firm/controllers/firm.controller';
import { FirmModule } from 'src/modules/firm/firm.module';
import { InterlocutorModule } from 'src/modules/interlocutor/Interlocutor.module';
import { InterlocutorController } from 'src/modules/interlocutor/controllers/interlocutor.controller';
import { InvoiceController } from 'src/modules/invoice/controllers/invoice.controller';
import { InvoiceModule } from 'src/modules/invoice/invoice.module';
import { PaymentConditionController } from 'src/modules/payment-condition/controllers/payment-condition.controller';
import { PaymentConditionModule } from 'src/modules/payment-condition/payment-condition.module';
import { PaymentController } from 'src/modules/payment/controllers/payment.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { QuotationController } from 'src/modules/quotation/controllers/quotation.controller';
import { QuotationModule } from 'src/modules/quotation/quotation.module';
import { TaxWithholdingController } from 'src/modules/tax-withholding/controllers/tax-withholding.controller';
import { TaxWithholdingModule } from 'src/modules/tax-withholding/tax-withholding.module';
import { TaxController } from 'src/modules/tax/controllers/tax.controller';
import { TaxModule } from 'src/modules/tax/tax.module';
import { TemplateCategoryController } from 'src/modules/template/controllers/template-category.controller';
import { TemplateModule } from 'src/modules/template/template.module';
import { UserController } from 'src/modules/user-management/controllers/user.controller';
import { RoleController } from 'src/modules/user-management/controllers/role.controller';
import { PermissionController } from 'src/modules/user-management/controllers/permission.controller';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';

@Module({
  controllers: [
    UserController,
    RoleController,
    PermissionController,
    ActivityController,
    AddressController,
    ArticleController,
    AppConfigController,
    BankAccountController,
    CabinetController,
    CountryController,
    CurrencyController,
    DefaultConditionController,
    FirmController,
    FirmInterlocutorEntryController,
    InterlocutorController,
    InvoiceController,
    PaymentController,
    PaymentConditionController,
    QuotationController,
    TaxController,
    TaxWithholdingController,
    TemplateCategoryController,
  ],
  providers: [],
  exports: [],
  imports: [
    LoggerModule,
    ActivityModule,
    AddressModule,
    ArticleModule,
    AppConfigModule,
    BankAccountModule,
    CabinetModule,
    CountryModule,
    CurrencyModule,
    DefaultConditionModule,
    FirmModule,
    FirmInterlocutorEntryModule,
    InterlocutorModule,
    InvoiceModule,
    PaymentConditionModule,
    PaymentModule,
    QuotationModule,
    TaxModule,
    TaxWithholdingModule,
    TemplateModule,
    UserManagementModule,
  ],
})
export class RoutesPublicModule {}