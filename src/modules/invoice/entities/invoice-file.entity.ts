import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { InvoiceEntity } from './invoice.entity';
import { UploadEntity } from 'src/shared/uploads/entities/upload.entity';

@Entity('invoice-upload')
export class InvoiceUploadEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InvoiceEntity)
  @JoinColumn({ name: 'invoiceId' })
  invoice: InvoiceEntity;

  @Column({ type: 'int' })
  invoiceId: number;

  @ManyToOne(() => UploadEntity)
  @JoinColumn({ name: 'uploadId' })
  upload: UploadEntity;

  @Column({ type: 'int' })
  uploadId: number;
}
