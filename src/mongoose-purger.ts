import {Injectable} from 'injection-js';
import {PurgerInterface} from '@rxstack/data-fixtures';
import {Connection} from 'mongoose';

@Injectable()
export class MongoosePurger implements PurgerInterface {

  constructor(private conn: Connection) { }

  async purge(): Promise<void> {
    await this.conn.dropDatabase();
  }
}