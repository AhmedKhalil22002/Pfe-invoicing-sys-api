import { Module } from '@nestjs/common';
import { FirmBankAccountService } from './services/firm-bank-account.service';
import { PermissionModule } from '../permission/permission.module';
import { UsersModule } from '../user/user.module';
import { FirmBankAccountRepository } from './repositories/firm-bank-account.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirmBankAccountEntity } from './entities/firm-bank-account.entity';

@Module({
  controllers: [],
  providers: [FirmBankAccountRepository, FirmBankAccountService],
  exports: [FirmBankAccountRepository, FirmBankAccountService],
  imports: [
    TypeOrmModule.forFeature([FirmBankAccountEntity]),
    PermissionModule,
    UsersModule,
  ],
})
export class FirmBankAccountModule {}
