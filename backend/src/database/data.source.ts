import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

ConfigModule.forRoot({
  envFilePath: ['.env', '../.env'],
});

const configService = new ConfigService();

export const dataSourceConfig: DataSourceOptions = {
  name: configService.get<string>('NODE_ENV'),
  type: configService.get<string>('TYPEORM_CONNECTION') as any,
  // Explicitly use process.env to ensure Docker overrides work
  host: process.env.TYPEORM_HOST || configService.get<string>('TYPEORM_HOST'),
  port: parseInt(
    process.env.TYPEORM_PORT || configService.get<string>('TYPEORM_PORT'),
    10,
  ),
  username: configService.get<string>('TYPEORM_USERNAME'),
  password: configService.get<string>('TYPEORM_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE'),
  entities: [__dirname + configService.get<string>('TYPEORM_ENTITIES')],
  migrations: [__dirname + configService.get<string>('TYPEORM_MIGRATIONS')],
  synchronize: configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',
  logging: configService.get<string>('TYPEORM_LOGGING') === 'true',
  // namingStrategy: new SnakeNamingStrategy(),
};

console.log('Database Config:', {
  host: dataSourceConfig.host,
  port: dataSourceConfig.port,
  user: dataSourceConfig.username,
  db: dataSourceConfig.database,
});

export default new DataSource(dataSourceConfig);
