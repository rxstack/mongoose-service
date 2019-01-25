import {UserNotFoundException, UserProviderInterface} from '@rxstack/security';
import {UserInterface} from '@rxstack/core';
import {Injectable} from 'injection-js';
import {MongooseService} from './mongoose-service';

@Injectable()
export class MongooseUserProvider implements UserProviderInterface {

  static readonly PROVIDE_NAME = 'mongoose';

  constructor(private userService: MongooseService<UserInterface>) { }

  async loadUserByUsername(username: string): Promise<UserInterface> {
    const user = await this.userService.findOne({'username': {'$eq': username}});
    if (user) return user; else throw new UserNotFoundException(username);
  }

  getName(): string {
    return MongooseUserProvider.PROVIDE_NAME;
  }
}