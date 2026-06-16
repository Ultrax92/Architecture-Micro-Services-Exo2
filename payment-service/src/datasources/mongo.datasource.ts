import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'mongo',
  connector: 'mongodb',
  url: process.env.MONGO_URL ?? '',
  host: process.env.MONGO_HOST ?? '127.0.0.1',
  port: +(process.env.MONGO_PORT ?? 27017),
  user: process.env.MONGO_USER ?? '',
  password: process.env.MONGO_PASSWORD ?? '',
  database: process.env.MONGO_DB ?? 'bookstore',
  useNewUrlParser: true,
};

@lifeCycleObserver('datasource')
export class MongoDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'mongo';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.mongo', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
