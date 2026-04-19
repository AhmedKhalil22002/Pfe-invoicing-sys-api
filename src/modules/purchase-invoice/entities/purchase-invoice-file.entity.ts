import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { PurchaseInvoiceEntity } from './purchase-invoice.entity';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

@Entity('purchase-invoice-upload')
export class PurchaseInvoiceStorageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseInvoiceEntity)
  @JoinColumn({ name: 'purchaseInvoiceId' })
  purchaseInvoice: PurchaseInvoiceEntity;

  @Column({ type: 'int' })
  purchaseInvoiceId: number;

  @ManyToOne(() => StorageEntity)
  @JoinColumn({ name: 'uploadId' })
  upload: StorageEntity;

  @Column({ type: 'int' })
  uploadId: number;
}
