import { REPOSITORIES } from '../config/constants';
import DataSource from './data.source';

export const databaseProviders = [
  {
    provide: REPOSITORIES.SOURCE,
    useFactory: async () => {
      // const config = await getTypeOrmConfig(configService);
      // const dataSource = DataSource;
      return DataSource.initialize();
    },
  },
];
