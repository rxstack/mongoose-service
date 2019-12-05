import {Module, ModuleWithProviders, COMMAND_REGISTRY} from '@rxstack/core';
import {Connection} from 'mongoose';
import mongoose = require('mongoose');
import {MongooseServiceModuleOptions} from './interfaces';
import {Provider} from 'injection-js';
import {DropCommand, EnsureIndexesCommand} from './commands';
import {ValidationObserver} from './validation.observer';
mongoose.Promise = global.Promise;

const winston = require('winston');

const connectionProvider =  async function(options: MongooseServiceModuleOptions): Promise<Provider> {
  const connection: Connection = await mongoose.createConnection(options.connection.uri, options.connection.options);
  return { provide: Connection, useValue: connection};
};

@Module()
export class MongooseServiceModule {
  static configure(configuration: MongooseServiceModuleOptions): ModuleWithProviders {
    configuration.logger = Object.assign({enabled: false, level: 'debug'}, configuration.logger);
    if (configuration.logger.enabled) {
      mongoose.set(configuration.logger.level, (collectionName: string, method: string, query: Object, doc: any) => {
        winston.log(configuration.logger.level, 'Mongoose', {
          'method': `${collectionName}.${method}`,
          'query': query,
          'doc': doc
        });
      });
    }

    return {
      module: MongooseServiceModule,
      providers: [
        connectionProvider(configuration),
        { provide: ValidationObserver, useClass: ValidationObserver},
        { provide: COMMAND_REGISTRY, useClass: EnsureIndexesCommand, multi: true },
        { provide: COMMAND_REGISTRY, useClass: DropCommand, multi: true },
      ]
    };
  }
}