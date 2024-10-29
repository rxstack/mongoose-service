import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, beforeEach, afterEach} from '@jest/globals';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {MONGOOSE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {MongooseService} from '../src';
import {Connection} from 'mongoose';

function wait(milliseconds: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe('MongooseService:MongooseServiceModule', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;

  beforeAll(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  afterAll(async() =>  {
    await injector.get(Connection).close();
    await wait(1000);
    await app.stop();
  });

  it('#Connection', () => {
    expect(injector.get(Connection)).toBeInstanceOf(Connection);
  });

  it('#TASK_SERVICE', () => {
    expect(injector.get(TASK_SERVICE)).toBeInstanceOf(MongooseService);
  });
});
