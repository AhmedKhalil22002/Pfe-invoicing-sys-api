import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { PAYMENT_MODE } from '../enums/payment-mode.enum';
import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreatePaymentUploadDto } from './payment-upload.create.dto';
import { CreatePaymentInvoiceEntryDto } from './payment-invoice-entry.create.dto';

export class CreatePaymentDto {
  @ApiProperty({ example: 1, type: Number })
  id?: number;

  @ApiProperty({
    example: '150.0',
    type: Number,
  })
  @IsPositive()
  amount?: number;

  @ApiProperty({ example: faker.date.anytime(), type: Date })
  date?: Date;

  @ApiProperty({
    example: PAYMENT_MODE.Cash,
    enum: PAYMENT_MODE,
  })
  @IsEnum(DISCOUNT_TYPES)
  mode?: PAYMENT_MODE;

  @ApiProperty({
    example: faker.hacker.phrase(),
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  uploads?: CreatePaymentUploadDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  invoices?: CreatePaymentInvoiceEntryDto[];
}
