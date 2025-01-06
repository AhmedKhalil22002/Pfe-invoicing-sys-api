import { ACCESS_TYPE } from 'src/app/enums/logger/access-types.enum';
import { EVENT_TYPE } from 'src/app/enums/logger/event-types.enum';
import { UserEntity } from 'src/modules/user/repositories/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('logger')
export class LoggerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ACCESS_TYPE, nullable: true })
  access_type: ACCESS_TYPE;

  @Column({ type: 'enum', enum: EVENT_TYPE, nullable: true })
  event: EVENT_TYPE;

  @Column({ type: 'boolean', default: true })
  event_result: boolean;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @ManyToOne(() => UserEntity, (user) => user.logs)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'int', nullable: true })
  userId: number;

  @CreateDateColumn()
  loggedAt?: Date;
}
