import {ServiceOptions} from '@rxstack/platform';
import {ConnectOptions, Model} from 'mongoose';

export interface MongooseServiceModuleOptions {
  connection: {
    uri: string;
    options?: ConnectOptions;
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
