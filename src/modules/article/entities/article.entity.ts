import { EntityHelper } from 'src/shared/database-v2/interfaces/database.entity.interface';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('article')
export class ArticleEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
}
