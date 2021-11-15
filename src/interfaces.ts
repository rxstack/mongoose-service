import {ServiceOptions} from '@rxstack/platform';
import {ConnectionOptions, Model} from 'mongoose';

export interface MongooseServiceModuleOptions {
  connection: {
    uri: string;
    options?: ConnectionOptions;
  };
  logger?: {
    enabled: boolean;
    level?: string
  };
}

export interface MongooseServiceOptions extends ServiceOptions {
  model: Model<any>;
  countLimit?: number;
}
