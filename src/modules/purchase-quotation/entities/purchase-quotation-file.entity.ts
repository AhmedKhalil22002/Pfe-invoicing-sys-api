import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { PurchaseQuotationEntity } from './purchase-quotation.entity';
import { StorageEntity } from 'src/shared/storage/entities/storage.entity';

@Entity('purchase_quotation_upload')
export class PurchaseQuotationStorageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseQuotationEntity)
  @JoinColumn({ name: 'purchaseQuotationId' })
  purchaseQuotation: PurchaseQuotationEntity;

  @Column({ type: 'int' })
  purchaseQuotationId: number;

  @ManyToOne(() => StorageEntity)
  @JoinColumn({ name: 'uploadId' })
  upload: StorageEntity;

  @Column({ type: 'int' })
  uploadId: number;
}
