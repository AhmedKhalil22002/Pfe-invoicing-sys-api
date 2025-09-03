import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { UploadEntity } from 'src/shared/storage/entities/upload.entity';
import { ActivityEntity } from 'src/modules/activity/entities/activity.entity';
import { CurrencyEntity } from 'src/modules/currency/entities/currency.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AddressEntity } from 'src/modules/address/entities/address.entity';

@Entity('cabinet')
export class CabinetEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  enterpriseName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  taxIdNumber: string;

  @ManyToOne(() => ActivityEntity)
  @JoinColumn({ name: 'activityId' })
  activity: ActivityEntity;

  @Column({ type: 'int', nullable: true })
  activityId: number;

  @ManyToOne(() => CurrencyEntity)
  @JoinColumn({ name: 'currencyId' })
  currency: CurrencyEntity;

  @Column({ type: 'int', nullable: true })
  currencyId: number;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'addressId' })
  address: AddressEntity;

  @Column({ type: 'int', nullable: true })
  addressId: number;

  @ManyToOne(() => UploadEntity)
  @JoinColumn({ name: 'logoId' })
  logo: UploadEntity;

  @Column({ type: 'int', nullable: true })
  logoId: number;

  @ManyToOne(() => UploadEntity)
  @JoinColumn({ name: 'signatureId' })
  signature: UploadEntity;

  @Column({ type: 'int', nullable: true })
  signatureId: number;
}
