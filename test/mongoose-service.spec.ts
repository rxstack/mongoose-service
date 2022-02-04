import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {MONGOOSE_SERVICE_OPTIONS, PROJECT_SERVICE, TASK_SERVICE} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {MongooseService} from '../src';
import {data1} from './mocks/data';
import {Task} from './mocks/task';
import {Connection} from 'mongoose';

describe('MongooseService:Impl', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;
  let service: MongooseService<Task>;

  before(async() =>  {
    await app.run();
    injector = app.getInjector();
    service = injector.get(TASK_SERVICE);
  });

  beforeEach(async () => {
    await injector.get(Connection).dropDatabase();
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

  it('#findMany with projection', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 0}, {'projection': {'completed': 1}});
    (typeof result[0]['name']).should.be.equal('undefined');
  });

  it('#count with no limit', async () => {
    const projectService = injector.get(PROJECT_SERVICE);
    const result = await projectService.count();
    result.should.be.equal(0);
  });

  it('#count with query and limit', async () => {
    await service.insertMany(data1);
    const result = await service.count({'name': {'$eq': 'task-1'}});
    result.should.be.equal(1);
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
