import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

ConfigModule.forRoot({
  envFilePath: `.env.${process.env.NODE_ENV}`,
});

const configService = new ConfigService();

export const dataSourceConfig: DataSourceOptions = {
  name: configService.get<string>('NODE_ENV'),
  type: configService.get<string>('TYPEORM_CONNECTION') as any,
  host: configService.get<string>('TYPEORM_HOST'),
  port: configService.get<number>('TYPEORM_PORT'),
  username: configService.get<string>('TYPEORM_USERNAME'),
  password: configService.get<string>('TYPEORM_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE'),
  entities: [__dirname + configService.get<string>('TYPEORM_ENTITIES')],
  migrations: [__dirname + configService.get<string>('TYPEORM_MIGRATIONS')],
  synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
  logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
  // namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(dataSourceConfig);
