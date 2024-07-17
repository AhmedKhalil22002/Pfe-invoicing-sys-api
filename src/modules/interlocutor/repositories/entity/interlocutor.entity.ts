import { SOCIAL_TITLES } from 'src/app/enums/social-titles.enum';
import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { FirmEntity } from 'src/modules/firm/repositories/entities/firm.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity('interlocutor')
export class InterlocutorEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: SOCIAL_TITLES, nullable: true })
  title: SOCIAL_TITLES;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  surname: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ManyToMany(() => FirmEntity, (firm) => firm.interlocutors, { eager: true })
  @JoinTable()
  firms: FirmEntity[];

  @OneToMany(() => FirmEntity, (firm) => firm.mainInterlocutor)
  @JoinTable()
  mainFirms: FirmEntity[];
}
