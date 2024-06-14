import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivityController } from 'src/modules/activity/controllers/activity.controller';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { CabinetController } from 'src/modules/cabinet/controllers/cabinet.controller';

@Module({
  controllers: [CabinetController, ActivityController],
  providers: [],
  exports: [],
  imports: [CabinetModule, ActivityModule],
})
export class RoutesPublicModule {}
