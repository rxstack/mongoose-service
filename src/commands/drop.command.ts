import {Injectable} from 'injection-js';
import {AbstractCommand} from '@rxstack/core';
import {Connection} from 'mongoose';

const chalk = require('chalk');

@Injectable()
export class DropCommand extends AbstractCommand {
  command = 'mongoose:drop';
  describe = 'Drop databases, collections and indexes for your documents.';

  async handler(): Promise<void> {
    console.log(chalk.blue('Dropping database ...'));
    const conn = this.injector.get(Connection);
    await conn.dropDatabase();
    console.log(chalk.green('Database has been dropped.'));
  }
}
