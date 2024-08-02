import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isMigration = this.isMigrationOrSeedCommand();
    return {
      type: this.configService.get('database.type', { infer: true }),
      url: this.configService.get('database.url', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: isMigration
        ? false
        : this.configService.get('database.synchronize', { infer: true }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging: false,
      // this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [
        __dirname + '/../../**/*.entity{.ts,.js}',
        __dirname + '/../../../modules/**/*.entity{.ts,.js}',
      ],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        subscribersDir: 'subscriber',
      },
      extra: {
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: this.configService.get(
                'database.rejectUnauthorized',
                { infer: true },
              ),
              ca:
                this.configService.get('database.ca', { infer: true }) ??
                undefined,
              key:
                this.configService.get('database.key', { infer: true }) ??
                undefined,
              cert:
                this.configService.get('database.cert', { infer: true }) ??
                undefined,
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }

  private isMigrationOrSeedCommand(): boolean {
    const migrationOrSeedKeywords = ['migration', 'seed'];
    return process.argv.some((arg) =>
      migrationOrSeedKeywords.some((keyword) => arg.includes(keyword)),
    );
  }
}
