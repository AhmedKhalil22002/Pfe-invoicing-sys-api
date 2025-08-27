import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
  controllers: [],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UsersModule {}
