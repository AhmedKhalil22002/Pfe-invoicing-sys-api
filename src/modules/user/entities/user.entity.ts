import { EntityHelper } from 'src/shared/database-v2/interfaces/database.entity.interface';
import { LoggerEntity } from 'src/shared/logger/repositories/entities/logger.entity';
import { UploadEntity } from 'src/shared/storage/repositories/entities/upload.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ type: 'int', nullable: true })
  roleId: number;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string;

  @ManyToOne(() => UploadEntity)
  @JoinColumn({ name: 'pictureId' })
  picture: UploadEntity;

  @Column({ type: 'int', nullable: true })
  pictureId: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => LoggerEntity, (log) => log.user)
  logs: LoggerEntity[];
}
