import { EntityHelper } from 'src/shared/database-v2/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tax-withholding')
export class TaxWithholdingEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string;

  @Column({ type: 'float', nullable: true })
  rate: number;
}
