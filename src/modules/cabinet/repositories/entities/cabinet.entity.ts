import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { ActivityEntity } from 'src/modules/activity/repositories/entities/activity.entity';
import { AddressEntity } from 'src/modules/address/repositories/entities/address.entity';
import { CurrencyEntity } from 'src/modules/currency/repositories/entities/currency.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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
}
