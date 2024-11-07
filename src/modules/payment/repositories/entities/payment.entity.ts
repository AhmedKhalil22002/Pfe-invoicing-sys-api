import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PAYMENT_MODE } from '../../enums/payment-mode.enum';
import { PaymentUploadEntity } from './payment-file.entity';
import { PaymentInvoiceEntryEntity } from './payment-invoice-entry.entity';

@Entity('payment')
export class PaymentEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ nullable: true })
  date: Date;

  @Column({ type: 'enum', enum: PAYMENT_MODE, nullable: true })
  mode: PAYMENT_MODE;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  notes: string;

  @OneToMany(() => PaymentUploadEntity, (upload) => upload.payment)
  uploads: PaymentUploadEntity[];

  @OneToMany(() => PaymentInvoiceEntryEntity, (invoice) => invoice.payment)
  invoices: PaymentInvoiceEntryEntity[];
}
