import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { UploadEntity } from 'src/shared/storage/entities/upload.entity';
import { PaymentEntity } from './payment.entity';

@Entity('payment-upload')
export class PaymentUploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PaymentEntity)
  @JoinColumn({ name: 'paymentId' })
  payment: PaymentEntity;

  @Column({ type: 'int' })
  paymentId: number;

  @ManyToOne(() => UploadEntity)
  @JoinColumn({ name: 'uploadId' })
  upload: UploadEntity;

  @Column({ type: 'int' })
  uploadId: number;
}
