import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from 'src/modules/permission/entities/permission.entity';
import { EntityHelper } from 'src/shared/database-v2/interfaces/database.entity.interface';

@Entity('role_permission')
export class RolePermissionEntryEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ type: 'int' })
  roleId: number;

  @ManyToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;

  @Column({ type: 'int' })
  permissionId: number;
}
