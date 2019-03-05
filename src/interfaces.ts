import {ServiceOptions} from '@rxstack/platform';
import {LoggingLevel} from '@rxstack/core';
import {ConnectionOptions, Model} from 'mongoose';

export interface MongooseServiceModuleOptions {
  connection: {
    uri: string;
    options?: ConnectionOptions;
  };
  logger?: {
    enabled: boolean;
    level?: LoggingLevel
  };
}

export interface MongooseServiceOptions extends ServiceOptions {
  model: Model<any>;
}
