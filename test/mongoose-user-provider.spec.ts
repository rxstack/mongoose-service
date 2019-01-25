import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {mongodbUri, MONGOOSE_SERVICE_OPTIONS, USER_SERVICE} from './mocks/MEMORY_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {MongooseService} from '../src';
import {Connection} from 'mongoose';
import {users} from './mocks/data';
import {PURGER_SERVICE} from '@rxstack/data-fixtures';
import {MongooseUserProvider} from '../src/mongoose-user.provider';
import {User} from './mocks/user';
import {UserNotFoundException} from '@rxstack/security';

describe('MongooseUserProvider:Impl', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;
  let provider: MongooseUserProvider;
  let service: MongooseService<User>;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    if (injector.get(Connection).readyState === 0) await injector.get(Connection).openUri(mongodbUri);
    provider = injector.get(MongooseUserProvider);
    service = injector.get(USER_SERVICE);
  });

  after(async() =>  {
    await injector.get(Connection).close();
    await app.stop();
  });

  beforeEach(async () => {
    await injector.get(PURGER_SERVICE).purge();
  });

  it('#loadUserByUsername should find the user', async () => {
    await service.insertMany(users);
    await provider.loadUserByUsername('admin');
  });

  it('#loadUserByUsername should throw an exception', async () => {
    let exception: UserNotFoundException;

    try {
      await provider.loadUserByUsername('admin');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UserNotFoundException);
  });

  it('should get provider name', async () => {
    provider.getName().should.be.equal(MongooseUserProvider.PROVIDE_NAME);
  });
});
