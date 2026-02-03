import { Module } from '@nestjs/common';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeederCommand } from './permissions.seeder';
import { RolesSeederCommand } from './roles.seeder';
import { AdminSeederCommand } from './admin.seeder';
import { CurrenciesSeederCommand } from './currencies.seeder';
import { CurrencyModule } from 'src/modules/currency/currency.module';

@Module({
  providers: [
    PermissionsSeederCommand,
    RolesSeederCommand,
    AdminSeederCommand,
    CurrenciesSeederCommand,
  ],
  imports: [UserManagementModule, CurrencyModule],
})
export class SeedersModule {}
