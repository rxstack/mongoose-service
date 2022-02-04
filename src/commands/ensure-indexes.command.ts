import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';
import {Connection} from 'mongoose';
import {keys} from 'lodash';

const chalk = require('chalk');

@Injectable()
export class EnsureIndexesCommand extends AbstractCommand {
  command = 'mongoose:ensure-indexes';
  describe = 'Makes the indexes in MongoDB match the indexes defined in this model\'s schema';

  async handler(): Promise<void> {
    console.log(chalk.blue('Ensuring indexes ...'));
    const conn = this.injector.get(Connection);
    const models = keys(conn.models);
    for (let i = 0; i < models.length; i++) {
      const model = conn.model(models[i]);
      await model.ensureIndexes({});
      console.log(chalk.gray(`Updating model "${models[i]}" ...`));
    }
    console.log(chalk.green('Indexes have been update.'));
  }
}
