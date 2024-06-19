import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('country')
export class CountryEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;
}
