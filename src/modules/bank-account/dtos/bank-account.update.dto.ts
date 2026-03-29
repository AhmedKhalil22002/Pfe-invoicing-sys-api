import { CreateBankAccountDto } from './bank-account.create.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateBankAccountDto extends PartialType(CreateBankAccountDto) {}
