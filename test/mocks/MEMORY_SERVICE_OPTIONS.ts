import {ApplicationOptions, UserInterface} from '@rxstack/core';
import {
  MongooseService, MongooseServiceModule
} from '../../src';
import {InjectionToken} from 'injection-js';
import {Task} from './task';
import {taskMongooseSchema} from './task.mongoose.schema';
import {MongoosePurger} from '../../src/mongoose-purger';
import {PURGER_SERVICE} from '@rxstack/data-fixtures';
import {MongooseUserProvider} from '../../src/mongoose-user.provider';
import {User} from './user';
import {userMongooseSchema} from './user.mongoose.schema';

export const TASK_SERVICE = new InjectionToken<MongooseService<Task>>('TASK_SERVICE');
export const USER_SERVICE = new InjectionToken<MongooseService<User>>('USER_SERVICE');
export const mongodbUri = 'mongodb://localhost:27017/test';

export const MONGOOSE_SERVICE_OPTIONS: ApplicationOptions = {
  imports: [MongooseServiceModule.configure({
    connection: {
      uri: mongodbUri,
      options: {
        useMongoClient: true
      }
    }
  })],
  providers: [
    {
      provide: TASK_SERVICE,
      useFactory: () => {
        return new MongooseService({ idField: 'id', name: 'Task', schema: taskMongooseSchema, collection: 'tasks' });
      },
      deps: [],
    },
    {
      provide: USER_SERVICE,
      useFactory: () => {
        return new MongooseService({ idField: 'id', name: 'User', schema: userMongooseSchema, collection: 'users' });
      },
      deps: [],
    },
    {
      provide: MongooseUserProvider,
      useFactory: (userService: MongooseService<UserInterface>) => {
        return new MongooseUserProvider(userService);
      },
      deps: [USER_SERVICE],
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