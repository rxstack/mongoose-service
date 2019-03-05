import 'reflect-metadata';
import {Application, ExceptionEvent, Request} from '@rxstack/core';
import {MONGOOSE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {MongooseService} from '../src';
import {Task} from './mocks/task';
import {Connection} from 'mongoose';
import * as _ from 'lodash';
import {Exception, transformToException} from '@rxstack/exceptions';
import {ValidationObserver} from '../src/validation.observer';

describe('MongooseService:ValidationObserver', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;
  let service: MongooseService<Task>;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    service = injector.get(TASK_SERVICE);
  });

  after(async() =>  {
    await app.stop();
  });

  beforeEach(async () => {
    await injector.get(Connection).dropDatabase();
  });

  it('#should throw BadRequestException', async () => {
    let exception: Exception;
    try {
      await service.insertOne({'name': ''});
    } catch (e) {
      exception = transformToException(e);
    }

    const request = new Request('HTTP');
    const event = new ExceptionEvent(exception,  request);
    const observer = injector.get(ValidationObserver);

    try {
      await observer.onException(event);
    } catch (e) {
      _.isEqual(e.data['errors'],
        [ { path: 'name', value: '', message: 'Path `name` is required.' } ]).should.be.equal(true);
    }
  });
});
