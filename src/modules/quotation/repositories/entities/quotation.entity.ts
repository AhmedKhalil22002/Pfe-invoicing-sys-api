import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { CurrencyEntity } from 'src/modules/currency/repositories/entities/currency.entity';
import { FirmEntity } from 'src/modules/firm/repositories/entities/firm.entity';
import { InterlocutorEntity } from 'src/modules/interlocutor/repositories/entity/interlocutor.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('quotation')
export class QuotationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  object: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  generalConditions: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status: string;

  @Column({ nullable: true })
  discount: number;

  @Column({ nullable: true })
  subTotal: number;

  @Column({ nullable: true })
  total: number;

  @ManyToOne(() => CurrencyEntity)
  @JoinColumn({ name: 'currencyId' })
  currency: CurrencyEntity;

  @Column({ type: 'int', nullable: true })
  currencyId: number;

  @ManyToOne(() => FirmEntity, { eager: true })
  @JoinColumn({ name: 'firmId' })
  firm: FirmEntity;

  @Column({ type: 'int', nullable: true })
  firmId: number;

  @ManyToOne(() => InterlocutorEntity, { eager: true })
  @JoinColumn({ name: 'interlocutorId' })
  interlocutor: InterlocutorEntity;

  @Column({ type: 'int', nullable: true })
  interlocutorId: number;
}
