import { REPOSITORIES } from '../shared/constants/constants';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: REPOSITORIES.SOURCE,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('TYPEORM_HOST'),
        port: parseInt(configService.get<string>('TYPEORM_PORT')),
        username:
          configService.get<string>('TYPEORM_USERNAME') ||
          configService.get<string>('POSTGRES_USER'),
        password:
          configService.get<string>('TYPEORM_PASSWORD') ||
          configService.get<string>('POSTGRES_PASSWORD'),
        database:
          configService.get<string>('TYPEORM_DATABASE') ||
          configService.get<string>('POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize:
          configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
      });

      console.log(
        `Connecting to DB at ${configService.get<string>(
          'TYPEORM_HOST',
        )}:${configService.get<number>('TYPEORM_PORT')}`,
      );

      return dataSource.initialize();
    },
  },
];
