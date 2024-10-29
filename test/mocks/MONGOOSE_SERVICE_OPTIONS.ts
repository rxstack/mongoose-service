import {projectMongooseSchema} from './project.mongoose.schema';

process.env.MONGO_HOST = process.env.MONGO_HOST || 'mongodb://localhost:27017/test';
import {ApplicationOptions} from '@rxstack/core';
import {
  MongooseService, MongooseServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Task} from './task';
import {taskMongooseSchema} from './task.mongoose.schema';
import {Connection} from 'mongoose';
import {CustomTransport} from './custom-transport.logger';

const winston = require('winston');
winston.add(new CustomTransport());

export const TASK_SERVICE = new InjectionToken<MongooseService<Task>>('TASK_SERVICE');
export const PROJECT_SERVICE = new InjectionToken<MongooseService<Task>>('PROJECT_SERVICE');

export const MONGOOSE_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [MongooseServiceModule.configure({
    connection: {
      uri: process.env.MONGO_HOST,
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
    {
      provide: PROJECT_SERVICE,
      useFactory: (conn: Connection) => {
        return new MongooseService({
          idField: '_id', defaultLimit: 25, model: conn.model('Project', projectMongooseSchema)
        });
      },
      deps: [Connection],
    },
  ]
};
