import { Module } from '@nestjs/common';
import { HelperModule } from './helper/helper.module';
import { GatewaysModule } from './gateways/gateways.module';

@Module({
  controllers: [],
  providers: [],
  imports: [HelperModule, GatewaysModule],
  exports: [HelperModule, GatewaysModule],
})
export class CommonModule {}
