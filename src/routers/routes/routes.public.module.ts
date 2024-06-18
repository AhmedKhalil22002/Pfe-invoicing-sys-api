import { Module } from '@nestjs/common';
import { ActivityModule } from 'src/modules/activity/activity.module';
import { ActivityController } from 'src/modules/activity/controllers/activity.controller';
import { CabinetModule } from 'src/modules/cabinet/cabinet.module';
import { CabinetController } from 'src/modules/cabinet/controllers/cabinet.controller';
import { TaxController } from 'src/modules/tax/controllers/tax.controller';
import { TaxModule } from 'src/modules/tax/tax.module';

@Module({
  controllers: [CabinetController, ActivityController, TaxController],
  providers: [],
  exports: [],
  imports: [CabinetModule, ActivityModule, TaxModule],
})
export class RoutesPublicModule {}
