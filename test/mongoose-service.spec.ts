import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {mongodbUri, MONGOOSE_SERVICE_OPTIONS, TASK_SERVICE} from './mocks/MEMORY_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {MongooseService} from '../src';
import {Connection} from 'mongoose';
import {data1} from './mocks/data';
import {Task} from './mocks/task';
import {PURGER_SERVICE} from '@rxstack/data-fixtures';

describe('MongooseService:Impl', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;
  let service: MongooseService<Task>;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
    if (injector.get(Connection).readyState === 0) await injector.get(Connection).openUri(mongodbUri);
    service = injector.get(TASK_SERVICE);
  });

  after(async() =>  {
    await injector.get(Connection).close();
    await app.stop();
  });

  beforeEach(async () => {
    await injector.get(PURGER_SERVICE).purge();
  });

  it('#insertOne', async () => {
    const data = data1[0];
    const obj = await service.insertOne(data);
    (typeof obj._id).should.equal('string');
    obj.name.should.be.equal(data.name);
    obj.completed.should.be.equal(false);
  });

  it('#insertMany', async () => {
    await service.insertMany(data1);
    const result = await service.count();
    result.should.be.equal(3);
  });

  it('#updateOne', async () => {
    await service.insertMany(data1);
    await service.updateOne('t-2', {
      'name': 'replaced'
    });
    const result = await service.find('t-2');
    result._id.should.be.equal('t-2');
    result.name.should.be.equal('replaced');
  });

  it('#updateMany', async () => {
    await service.insertMany(data1);
    const cnt = await service.updateMany({'_id': {'$eq': 't-2'}}, {'name': 'patched'});
    cnt.should.be.equal(1);
    const result = await service.find('t-2');
    result.name.should.be.equal('patched');
  });

  it('#removeOne', async () => {
    await service.insertMany(data1);
    await service.removeOne('t-2');
    const result = await service.find('t-2');
    (!!result).should.be.equal(false);
  });

  it('#removeMany', async () => {
    await service.insertMany(data1);
    const result = await service.removeMany({ '_id': {'$eq': 't-2'}});
    result.should.equal(1);
    const cnt = await service.count();
    cnt.should.equal(2);
  });

  it('#findMany', async () => {
    await service.insertMany(data1);
    const result = await service.findMany();
    result.length.should.be.equal(3);
  });

  it('#findMany with query', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {'name': {'$eq': 'task-1'}}, limit: 10, skip: 0});
    result.length.should.be.equal(1);
  });

  it('#findMany with sort', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 1, sort: {'name': -1}});
    result[0].name.should.be.equal('task-2');
  });

  it('#count', async () => {
    await service.insertMany(data1);
    const result = await service.count();
    result.should.be.equal(3);
  });

  it('#count with query', async () => {
    await service.insertMany(data1);
    const result = await service.count({'name': {'$eq': 'task-1'}});
    result.should.be.equal(1);
  });

  it('#findOne', async () => {
    await service.insertMany(data1);
    const result = await service.findOne({'name': {'$eq': 'task-1'}});
    result.name.should.be.equal('task-1');
  });
});
