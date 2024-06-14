import { registerAs } from '@nestjs/config';
import { APP_LANGUAGE } from 'src/app/constants/app.constant';
import { ENUM_APP_ENVIRONMENT } from 'src/app/constants/app.enum.constant';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME ?? 'Invoice System API Server',
    env: process.env.APP_ENV ?? ENUM_APP_ENVIRONMENT.DEVELOPMENT,
    language: process.env.APP_LANGUAGE?.split(',') ?? [APP_LANGUAGE],

    globalPrefix: '/api',
    http: {
      enable: process.env.HTTP_ENABLE === 'true' ?? false,
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },

    jobEnable: process.env.JOB_ENABLE === 'true' ?? false,
  }),
);
