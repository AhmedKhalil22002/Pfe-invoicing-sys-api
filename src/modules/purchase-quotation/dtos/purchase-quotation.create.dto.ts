import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
//import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { CreateArticlePurchaseQuotationEntryDto } from 'src/modules/purchase-quotation/dtos/article-purchase-quotation-entry.create.dto';
import { PURCHASE_QUOTATION_STATUS } from '../enums/purchase-quotation-status.enum';
import { CreatePurchaseQuotationMetaDataDto } from './purchase-quotation-meta-data.create.dto';
import { CreatePurchaseQuotationUploadDto } from './purchase-quotation-upload.create.dto';

export class CreatePurchaseQuotationDto {
  @ApiProperty({ example: 1, type: Number })
  @IsOptional()
  @IsInt()
  cabinetId?: number;

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
    example: PURCHASE_QUOTATION_STATUS.Draft,
    enum: PURCHASE_QUOTATION_STATUS,
  })
  @IsOptional()
  @IsEnum(PURCHASE_QUOTATION_STATUS)
  status?: PURCHASE_QUOTATION_STATUS;

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

  @ApiProperty({ type: () => CreateArticlePurchaseQuotationEntryDto, isArray: true })
  @IsOptional()
  articlePurchaseQuotationEntries?: CreateArticlePurchaseQuotationEntryDto[];

  @ApiProperty({ type: () => CreatePurchaseQuotationMetaDataDto })
  @IsOptional()
  purchaseQuotationMetaData?: CreatePurchaseQuotationMetaDataDto;

  @ApiProperty({ required: false })
  @IsOptional()
  uploads?: CreatePurchaseQuotationUploadDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  invoiceId?: number;
}
