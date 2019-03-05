import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';
import {Connection} from 'mongoose';
import {keys} from 'lodash';

const chalk = require('chalk');

@Injectable()
export class EnsureIndexesCommand extends AbstractCommand {
  command = 'mongoose:ensure-indexes';
  describe = 'Makes the indexes in MongoDB match the indexes defined in this model\'s schema';

  async handler(argv: any): Promise<void> {
    console.log(chalk.blue('Ensuring indexes ...'));
    const conn = this.injector.get(Connection);
    const models = keys(conn.models);
    for await (const key of models) {
      const model = conn.model(key);
      await model.ensureIndexes({});
      console.log(chalk.gray(`Updating model "${key}" ...`));
    }
    console.log(chalk.green('Indexes have been update.'));
  }
}