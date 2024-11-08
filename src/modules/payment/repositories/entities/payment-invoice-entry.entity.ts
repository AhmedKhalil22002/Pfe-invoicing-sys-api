import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { InvoiceEntity } from 'src/modules/invoice/repositories/entities/invoice.entity';

@Entity('payment_invoice_entry')
export class PaymentInvoiceEntryEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PaymentEntity)
  @JoinColumn({ name: 'paymentId' })
  payment: PaymentEntity;

  @Column({ type: 'int' })
  paymentId: number;

  @ManyToOne(() => InvoiceEntity)
  @JoinColumn({ name: 'invoicetId' })
  invoice: InvoiceEntity;

  @Column({ type: 'int' })
  invoicetId: number;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ type: 'float', nullable: true })
  convertionRate: number;
}
