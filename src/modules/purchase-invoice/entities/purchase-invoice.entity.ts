import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PURCHASE_INVOICE_STATUS } from '../enums/purchase-invoice-status.enum';
import { DISCOUNT_TYPES } from 'src/app/enums/discount-types.enum';
import { CurrencyEntity } from 'src/modules/currency/entities/currency.entity';
import { FirmEntity } from 'src/modules/firm/entities/firm.entity';
import { CabinetEntity } from 'src/modules/cabinet/entities/cabinet.entity';
import { TaxWithholdingEntity } from 'src/modules/tax-withholding/entities/tax-withholding.entity';
// import { PaymentPurchaseInvoiceEntryEntity } from 'src/modules/purchase-invoice-payment/entities/purchase-invoice-payment-entry.entity';
import { TaxEntity } from 'src/modules/tax/entities/tax.entity';
import { PurchaseQuotationEntity } from 'src/modules/purchase-quotation/entities/purchase-quotation.entity';
import { PurchaseInvoiceStorageEntity } from './purchase-invoice-file.entity';
import { PurchaseInvoiceMetaDataEntity } from './purchase-invoice-meta-data.entity';
import { BankAccountEntity } from 'src/modules/bank-account/entities/bank-account.entity';
import { ArticlePurchaseInvoiceEntryEntity } from './article-purchase-invoice-entry.entity';
import { InterlocutorEntity } from 'src/modules/interlocutor/entities/interlocutor.entity';

@Entity('purchase_invoice')
export class PurchaseInvoiceEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 25, unique: true })
  sequential: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  object: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  generalConditions: string;

  @Column({ type: 'enum', enum: PURCHASE_INVOICE_STATUS, nullable: true })
  status: PURCHASE_INVOICE_STATUS;

  @Column({ nullable: true })
  discount: number;

  @Column({ type: 'enum', enum: DISCOUNT_TYPES, nullable: true })
  discount_type: DISCOUNT_TYPES;

  @Column({ type: 'float', nullable: true })
  subTotal: number;

  @Column({ type: 'float', nullable: true })
  total: number;

  @Column({ type: 'float', nullable: true })
  amountPaid: number;

  @ManyToOne(() => CurrencyEntity)
  @JoinColumn({ name: 'currencyId' })
  currency: CurrencyEntity;

  @Column({ type: 'int' })
  currencyId: number;

  @ManyToOne(() => FirmEntity)
  @JoinColumn({ name: 'firmId' })
  firm: FirmEntity;

  @Column({ type: 'int' })
  firmId: number;

  @ManyToOne(() => InterlocutorEntity)
  @JoinColumn({ name: 'interlocutorId' })
  interlocutor: InterlocutorEntity;

  @ManyToOne(() => CabinetEntity)
  @JoinColumn({ name: 'cabinetId' })
  cabinet: CabinetEntity;

  @Column({ type: 'int', default: 1 })
  cabinetId: number;

  @Column({ type: 'int' })
  interlocutorId: number;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  notes: string;

  @OneToMany(() => ArticlePurchaseInvoiceEntryEntity, (entry) => entry.purchaseInvoice)
  articlePurchaseInvoiceEntries: ArticlePurchaseInvoiceEntryEntity[];

  @OneToOne(() => PurchaseInvoiceMetaDataEntity)
  @JoinColumn()
  purchaseInvoiceMetaData: PurchaseInvoiceMetaDataEntity;

  @ManyToOne(() => BankAccountEntity)
  @JoinColumn({ name: 'bankAccountId' })
  bankAccount: BankAccountEntity;

  @Column({ type: 'int' })
  bankAccountId: number;

  @OneToMany(() => PurchaseInvoiceStorageEntity, (upload) => upload.purchaseInvoice)
  uploads: PurchaseInvoiceStorageEntity[];

  @ManyToOne(() => PurchaseQuotationEntity)
  @JoinColumn({ name: 'purchaseQuotationId' })
  purchaseQuotation: PurchaseQuotationEntity;

  @Column({ type: 'int', nullable: true })
  purchaseQuotationId: number;

  @ManyToOne(() => TaxEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'taxStampId' })
  taxStamp: TaxEntity;

  @Column({ type: 'int', nullable: true })
  taxStampId: number;

  // @OneToMany(() => PaymentPurchaseInvoiceEntryEntity, (entry) => entry.purchaseInvoice)
  // payments: PaymentPurchaseInvoiceEntryEntity[];

  @ManyToOne(() => TaxWithholdingEntity)
  @JoinColumn({ name: 'taxWithholdingId' })
  taxWithholding: TaxWithholdingEntity;

  @Column({ type: 'int', nullable: true })
  taxWithholdingId: number;

  @Column({ type: 'float', nullable: true })
  taxWithholdingAmount: number;
}
