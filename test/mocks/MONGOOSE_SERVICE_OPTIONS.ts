process.env.MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost:27017/test';
import {ApplicationOptions} from '@rxstack/core';
import {
  MongooseService, MongooseServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Task} from './task';
import {taskMongooseSchema} from './task.mongoose.schema';
import {Connection} from 'mongoose';

export const TASK_SERVICE = new InjectionToken<MongooseService<Task>>('TASK_SERVICE');

export const MONGOOSE_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [MongooseServiceModule.configure({
    connection: {
      uri: process.env.MONGO_HOST,
      options: {
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    },
    logger: {
      enabled: true
    }
  })],
  providers: [
    {
      provide: TASK_SERVICE,
      useFactory: (conn: Connection) => {
        return new MongooseService({
          idField: '_id', defaultLimit: 25, model: conn.model('Task', taskMongooseSchema), countLimit: 1000
        });
      },
      deps: [Connection],
    },
  ]
};
