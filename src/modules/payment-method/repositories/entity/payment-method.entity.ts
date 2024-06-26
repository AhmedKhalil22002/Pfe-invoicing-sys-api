import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('payment-method')
export class PaymentMethodEntity extends EntityHelper {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string;
}
