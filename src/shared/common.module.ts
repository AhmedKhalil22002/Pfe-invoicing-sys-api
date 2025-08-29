import { Module } from '@nestjs/common';
import { GatewaysModule } from './gateways/gateways.module';
import { DatabaseModule } from './database/database.module';
import { DatabaseModule as DatabaseV2Module } from './database-v2/database.module';

@Module({
  controllers: [],
  providers: [],
  imports: [GatewaysModule, DatabaseModule, DatabaseV2Module],
  exports: [GatewaysModule, DatabaseModule, DatabaseV2Module],
})
export class CommonModule {}
