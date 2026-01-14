import { Module } from '@nestjs/common';
import { CommonModule } from 'src/shared/common.module';
import { HelloController } from './controllers/app.controller';
import { ConfigModule } from '@nestjs/config';
import configs from 'src/configs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from 'src/routers/router.module';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { TranslationConfigService } from 'src/shared/translation/services/translation-config.service';
import { TranslationModule } from 'src/shared/translation/translation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmConfigService } from 'src/shared/database/services/database-config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { resolveMX } from 'src/shared/mail/utils/mx-resolve.util';
import { MailModule } from 'src/shared/mail/mail.module';
import { DatabaseModule } from 'src/shared/database/database.module';

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
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    I18nModule.forRootAsync({
      imports: [TranslationModule],
      useClass: TranslationConfigService,
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    CommonModule,
    DatabaseModule,
    TranslationModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: DataSource,
          }),
        }),
      ],
    }),
    MailerModule.forRootAsync({
      useFactory: async () => {
        const email = process.env.SMTP_USER;
        if (!email) throw new Error('SMTP_USER is not set');

        const domain = email.split('@')[1];
        if (!domain) throw new Error(`Invalid SMTP_USER: ${email}`);

        const { host, port } = await resolveMX(domain);

        return {
          transport: {
            host,
            port,
            secure: port === 465, // Use secure for 465, STARTTLS for 587
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
    MailModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    RouterModule.forRoot(),
  ],
})
export class AppModule {}
