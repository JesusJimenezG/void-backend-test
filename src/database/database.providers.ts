import { REPOSITORIES } from 'src/config/constants';
import DataSource from 'src/config/data.source';

export const databaseProviders = [
  {
    provide: REPOSITORIES.SOURCE,
    useFactory: async () => {
      const dataSource = DataSource;
      return dataSource.initialize();
    },
  },
];
