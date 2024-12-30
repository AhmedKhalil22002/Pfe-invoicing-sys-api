import { EntityHelper } from 'src/common/database/interfaces/database.entity.interface';
import { UploadEntity } from 'src/common/storage/repositories/entities/upload.entity';
import { RoleEntity } from 'src/modules/role/repositories/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ type: 'int' })
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
}
