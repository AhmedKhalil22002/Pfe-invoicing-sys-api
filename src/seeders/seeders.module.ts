import { Module } from '@nestjs/common';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeederCommand } from './permissions.seeder';
import { RolesSeederCommand } from './roles.seeder';
import { AdminSeederCommand } from './admin.seeder';
import { CurrenciesSeederCommand } from './currencies.seeder';
import { CurrencyModule } from 'src/modules/currency/currency.module';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivitiesSeederCommand } from './activities.seeder';
import { PaymentConditionsSeederCommand } from './payment-conditions.seeder';
import { PaymentConditionModule } from 'src/modules/payment-condition/payment-condition.module';
import { CountryModule } from 'src/modules/country/country.module';
import { CountriesSeederCommand } from './countries.seeder';
import { CabinetSeederCommand } from './cabinet.seeder';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { AddressModule } from 'src/modules/address/address.module';
@Module({
  providers: [
    PermissionsSeederCommand,
    RolesSeederCommand,
    AdminSeederCommand,
    CurrenciesSeederCommand,
    ActivitiesSeederCommand,
    PaymentConditionsSeederCommand,
    CountriesSeederCommand,
    CabinetSeederCommand,
  ],
  imports: [
    UserManagementModule,
    CurrencyModule,
    ActivityModule,
    PaymentConditionModule,
    CountryModule,
    CabinetModule,
    AddressModule,
  ],
})
export class SeedersModule {}
