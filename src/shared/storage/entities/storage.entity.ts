import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('storage')
export class StorageEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1024 })
  slug: string;

  @Column({ type: 'varchar', length: 1024 })
  filename: string;

  @Column({ type: 'text' })
  relativePath: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column({ type: 'boolean' })
  isTemporary: boolean;
}
