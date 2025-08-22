import { Module } from '@nestjs/common';
import { LoggerController } from 'src/shared/logger/controllers/logger.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [LoggerController],
  providers: [],
  exports: [],
  imports: [LoggerModule],
})
export class RoutesAdminModule {}
