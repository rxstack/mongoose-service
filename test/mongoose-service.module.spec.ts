import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {mongodbUri, MONGOOSE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/MEMORY_SERVICE_OPTIONS';
import {MongooseService} from '../src';
import {Connection} from 'mongoose';

describe('MongooseService:MongooseServiceModule', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    if (injector.get(Connection).readyState === 0) await injector.get(Connection).openUri(mongodbUri);
  });

  after(async() =>  {
    await injector.get(Connection).close();
    await app.stop();
  });

  it('#Connection', () => {
    injector.get(Connection).should.be.instanceOf(Connection);
  });

  it('#TASK_SERVICE', () => {
    injector.get(TASK_SERVICE).should.be.instanceOf(MongooseService);
  });
});
