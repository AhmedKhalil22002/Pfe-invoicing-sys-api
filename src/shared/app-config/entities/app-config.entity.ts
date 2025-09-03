import { EntityHelper } from 'src/shared/database-v2/interfaces/database.entity.interface';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('app_config')
export class AppConfigEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  key: string;

  @Column({ type: 'json', nullable: true })
  value: any;
}
