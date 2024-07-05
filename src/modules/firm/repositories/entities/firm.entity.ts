import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { ActivityEntity } from 'src/modules/activity/repositories/entities/activity.entity';
import { AddressEntity } from 'src/modules/address/repositories/entities/address.entity';
import { CabinetEntity } from 'src/modules/cabinet/repositories/entities/cabinet.entity';
import { CurrencyEntity } from 'src/modules/currency/repositories/entities/currency.entity';
import { InterlocutorEntity } from 'src/modules/interlocutor/repositories/entity/interlocutor.entity';
import { PaymentConditionEntity } from 'src/modules/payment-condition/repositories/entity/payment-condition.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('firm')
export class FirmEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  website: string;

  @Column({ type: 'boolean', default: true })
  isPerson: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  taxIdNumber: string;

  @Column({ type: 'varchar', length: 1024, nullable: false })
  notes: string;

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

  @ManyToOne(() => PaymentConditionEntity)
  @JoinColumn({ name: 'paymentConditionId' })
  paymentCondition: PaymentConditionEntity;

  @Column({ type: 'int', nullable: true })
  paymentConditionId: number;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'invoicingAddressId' })
  invoicingAddress: AddressEntity;

  @Column({ type: 'int', nullable: true })
  invoicingAddressId: number;

  @ManyToOne(() => AddressEntity)
  @JoinColumn({ name: 'deliveryAddressId' })
  deliveryAddress: AddressEntity;

  @Column({ type: 'int', nullable: true })
  deliveryAddressId: number;

  @ManyToOne(() => CabinetEntity)
  @JoinColumn({ name: 'cabinetId' })
  cabinet: CabinetEntity;

  @Column({ type: 'int', nullable: true })
  cabinetId: number;

  @ManyToMany(() => InterlocutorEntity)
  @JoinTable()
  interlocutors: InterlocutorEntity[];

  @ManyToOne(() => InterlocutorEntity)
  @JoinColumn({ name: 'mainInterlocutorId' })
  mainInterlocutor: InterlocutorEntity;

  @Column({ type: 'int', nullable: true })
  mainInterlocutorId: number;
}
