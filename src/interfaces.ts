import {ServiceOptions} from '@rxstack/platform';
import {ConnectionOptions, Schema} from 'mongoose';

export interface MongooseServiceModuleOptions {
  connection: {
    uri: string;
    options?: ConnectionOptions;
  };
}

export interface MongooseServiceOptions extends ServiceOptions {
  name: string;
  schema?: Schema;
  collection?: string;
}
