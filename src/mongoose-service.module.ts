import {Module, ModuleWithProviders} from '@rxstack/core';
import {Connection} from 'mongoose';
import mongoose = require('mongoose');
import {MongooseServiceModuleOptions} from './interfaces';
import {Provider} from 'injection-js';
mongoose.Promise = global.Promise;

const mongooseProvider =  async function(options: MongooseServiceModuleOptions): Promise<Provider> {
  const connection: Connection = await mongoose.createConnection(options.connection.uri, options.connection.options);
  return { provide: Connection, useValue: connection};
};

@Module()
export class MongooseServiceModule {
  static configure(configuration: MongooseServiceModuleOptions): ModuleWithProviders {
    return {
      module: MongooseServiceModule,
      providers: [mongooseProvider(configuration)]
    };
  }
}