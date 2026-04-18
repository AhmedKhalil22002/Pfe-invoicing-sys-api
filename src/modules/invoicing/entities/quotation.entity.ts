import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('_quotation')
export class QuotationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['incoming', 'outgoing'] })
  direction: 'incoming' | 'outgoing';

  //@Column({ type: 'varchar', unique: true })
  //sequence: string;

  @Column({ nullable: true })
  date: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  object: string;

  @Column({ type: 'varchar', nullable: true })
  generalConditions: string;
}
