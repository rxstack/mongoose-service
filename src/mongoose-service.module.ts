import {Module, ModuleWithProviders, COMMAND_REGISTRY} from '@rxstack/core';
import {Connection} from 'mongoose';
import mongoose = require('mongoose');
import {MongooseServiceModuleOptions} from './interfaces';
import {Provider} from 'injection-js';
import {DropCommand, EnsureIndexesCommand} from './commands';
mongoose.Promise = global.Promise;

const winstonLogger = require('winston');

mongoose.set('debug', (collectionName: string, method: string, query: Object, doc: any, optins: any) => {
  winstonLogger.log('debug', 'Mongoose', {
    'method': `${collectionName}.${method}`,
    'query': query,
    'doc': doc,
    'options': optins
  });
});

const connectionProvider =  async function(options: MongooseServiceModuleOptions): Promise<Provider> {
  const connection: Connection = await mongoose.createConnection(options.connection.uri, options.connection.options);
  return { provide: Connection, useValue: connection};
};

@Module()
export class MongooseServiceModule {
  static configure(configuration: MongooseServiceModuleOptions): ModuleWithProviders {
    return {
      module: MongooseServiceModule,
      providers: [
        connectionProvider(configuration),
        { provide: COMMAND_REGISTRY, useClass: EnsureIndexesCommand, multi: true },
        { provide: COMMAND_REGISTRY, useClass: DropCommand, multi: true },
      ]
    };
  }
}