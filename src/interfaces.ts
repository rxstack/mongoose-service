import {ServiceOptions} from '@rxstack/platform';
import {ConnectionOptions, Model} from 'mongoose';

export interface MongooseServiceModuleOptions {
  connection: {
    uri: string;
    options?: ConnectionOptions;
  };
}

export interface MongooseServiceOptions extends ServiceOptions {
  model: Model<any>;
}
