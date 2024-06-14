import { Module } from '@nestjs/common';
import { HelperModule } from './helper/helper.module';

@Module({
  controllers: [],
  providers: [],
  imports: [HelperModule],
})
export class CommonModule {}
