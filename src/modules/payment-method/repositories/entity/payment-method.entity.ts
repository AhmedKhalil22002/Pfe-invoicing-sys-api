import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payment-method')
export class PaymentMethodEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;
}
