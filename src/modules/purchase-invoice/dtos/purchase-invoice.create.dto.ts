import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { PURCHASE_INVOICE_STATUS } from '../enums/purchase-invoice-status.enum';
import { CreateArticlePurchaseInvoiceEntryDto } from './article-purchase-invoice-entry.create.dto';
import { CreatePurchaseInvoiceMetaDataDto } from './purchase-invoice-meta-data.create.dto';
import { CreatePurchaseInvoiceUploadDto } from './purchase-invoice-upload.create.dto';

export class CreatePurchaseInvoiceDto {
  @ApiProperty({ example: faker.date.anytime() })
  date?: Date;

  @ApiProperty({ example: faker.date.anytime() })
  dueDate?: Date;

  @ApiProperty({
    example: faker.finance.transactionDescription(),
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  object?: string;

  @ApiProperty({
    example: faker.hacker.phrase(),
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  generalConditions?: string;

  @ApiProperty({
    example: PURCHASE_INVOICE_STATUS.Unpaid,
    enum: PURCHASE_INVOICE_STATUS,
  })
  @IsOptional()
  @IsEnum(PURCHASE_INVOICE_STATUS)
  status?: PURCHASE_INVOICE_STATUS;

  @ApiProperty({
    example: '0.1',
    type: Number,
  })
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: DISCOUNT_TYPES.PERCENTAGE, enum: DISCOUNT_TYPES })
  @IsOptional()
  @IsEnum(DISCOUNT_TYPES)
  discount_type?: DISCOUNT_TYPES;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  currencyId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  bankAccountId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  firmId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  interlocutorId?: number;

  @ApiProperty({
    example: faker.hacker.phrase(),
    type: String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1024)
  notes?: string;

  @ApiProperty({ type: () => CreateArticlePurchaseInvoiceEntryDto, isArray: true })
  @IsOptional()
  articlePurchaseInvoiceEntries?: CreateArticlePurchaseInvoiceEntryDto[];

  @ApiProperty({ type: () => CreatePurchaseInvoiceMetaDataDto })
  @IsOptional()
  purchaseInvoiceMetaData?: CreatePurchaseInvoiceMetaDataDto;

  @ApiProperty({ required: false })
  @IsOptional()
  uploads?: CreatePurchaseInvoiceUploadDto[];

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  purchaseQuotationId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  taxStampId?: number;

  @ApiProperty({
    example: '1',
    type: Number,
  })
  @IsOptional()
  @IsInt()
  taxWithholdingId?: number;
}
