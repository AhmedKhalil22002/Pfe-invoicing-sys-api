import { Module } from '@nestjs/common';
import { BankAccountService } from './services/bank-account.service';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountEntity } from './entities/bank-account.entity';

@Module({
  controllers: [],
  providers: [BankAccountRepository, BankAccountService],
  exports: [BankAccountRepository,BankAccountService],
  imports: [TypeOrmModule.forFeature([BankAccountEntity])],
})
export class BankAccountModule {}
