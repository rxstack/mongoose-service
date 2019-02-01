require('dotenv').config();
import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {MONGOOSE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {MongooseService} from '../src';
import {Connection} from 'mongoose';

describe('MongooseService:MongooseServiceModule', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('#Connection', () => {
    injector.get(Connection).should.be.instanceOf(Connection);
  });

  it('#TASK_SERVICE', () => {
    injector.get(TASK_SERVICE).should.be.instanceOf(MongooseService);
  });
});
