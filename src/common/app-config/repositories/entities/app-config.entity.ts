import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('app-config')
export class AppConfigEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'json', nullable: true })
  value: any;
}
