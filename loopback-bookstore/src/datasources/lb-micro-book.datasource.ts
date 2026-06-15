import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'lbMicroBook',
  connector: 'mongodb',
  url: process.env.MONGO_URL ?? '',
  host: process.env.MONGO_HOST ?? '127.0.0.1',
  port: +(process.env.MONGO_PORT ?? 27017),
  user: process.env.MONGO_USER ?? '',
  password: process.env.MONGO_PASSWORD ?? '',
  database: process.env.MONGO_DB ?? 'lbMicroBook',
  useNewUrlParser: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class LbMicroBookDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'lbMicroBook';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.lbMicroBook', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
