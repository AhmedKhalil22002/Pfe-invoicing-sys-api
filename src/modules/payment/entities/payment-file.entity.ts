import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { PaymentEntity } from './payment.entity';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';

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
