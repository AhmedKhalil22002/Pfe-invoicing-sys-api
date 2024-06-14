import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { HelloController } from './controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/common/database/services/database-config.service';
import { RouterModule } from 'src/routers/router.module';

@Module({
  controllers: [HelloController],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: !process.env.NODE_ENV
        ? '.env'
        : `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CommonModule,
    RouterModule.forRoot(),
  ],
})
export class AppModule {}
