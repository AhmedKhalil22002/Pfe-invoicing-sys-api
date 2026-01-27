import { Module } from '@nestjs/common';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PermissionsSeederCommand } from './permissions.seeder';
import { RolesSeederCommand } from './roles.seeder';
import { AdminSeederCommand } from './admin.seeder';

@Module({
  imports: [UserManagementModule],
  providers: [PermissionsSeederCommand, RolesSeederCommand, AdminSeederCommand],
})
export class SeedersModule {}
