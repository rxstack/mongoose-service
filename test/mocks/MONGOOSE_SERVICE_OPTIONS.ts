process.env.MONGO_HOST = process.env.MONGO_HOST || 'mongodb://mongo:27017/test'
import {ApplicationOptions} from '@rxstack/core';
import {
  MongooseService, MongooseServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Task} from './task';
import {taskMongooseSchema} from './task.mongoose.schema';
import {MongoosePurger} from '../../src/mongoose-purger';
import {PURGER_SERVICE} from '@rxstack/data-fixtures';
import {Connection} from 'mongoose';

export const TASK_SERVICE = new InjectionToken<MongooseService<Task>>('TASK_SERVICE');

export const MONGOOSE_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [MongooseServiceModule.configure({
    connection: {
      uri: process.env.MONGO_HOST,
      options: {
        useMongoClient: true
      }
    }
  })],
  providers: [
    {
      provide: TASK_SERVICE,
      useFactory: (conn: Connection) => {
        return new MongooseService({
          idField: 'id', defaultLimit: 25, model: conn.model('Task', taskMongooseSchema)
        });
      },
      deps: [Connection],
    },
    { provide: PURGER_SERVICE, useClass: MongoosePurger },
  ],
  logger: {
    handlers: [
      {
        type: 'console',
        options: {
          level: 'silly',
        }
      }
    ]
  },
};