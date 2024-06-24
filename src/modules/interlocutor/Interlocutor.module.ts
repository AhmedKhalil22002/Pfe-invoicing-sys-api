import { Module } from '@nestjs/common';
import { InterlocutorService } from './services/interlocutor.service';
import { InterlocutorRepositoryModule } from './repositories/interlocutor.repository.module';

@Module({
  controllers: [],
  providers: [InterlocutorService],
  exports: [InterlocutorService],
  imports: [InterlocutorRepositoryModule],
})
export class InterlocutorModule {}
