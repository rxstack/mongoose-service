import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, beforeEach, afterEach} from '@jest/globals';
import {Application} from '@rxstack/core';
import {MONGOOSE_SERVICE_OPTIONS, PROJECT_SERVICE, TASK_SERVICE} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {Injector} from 'injection-js';
import {MongooseService} from '../src';
import {data1} from './mocks/data';
import {Task} from './mocks/task';
import {Connection} from 'mongoose';

function wait(milliseconds: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe('MongooseService:Impl', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let injector: Injector;
  let service: MongooseService<Task>;

  beforeAll(async() =>  {
    await app.run();
    injector = app.getInjector();
    service = injector.get(TASK_SERVICE);
  });

  beforeEach(async () => {
    await injector.get(Connection).dropDatabase();
    wait(2000);
  });

  afterAll(async() =>  {
    await injector.get(Connection).close();
    await wait(1000);
  });

  it('#insertOne', async () => {
    const data = data1[0];
    const obj = await service.insertOne(data);
    expect(typeof obj._id).toBe('string');
    expect(obj.name).toBe(data.name);
    expect(obj.completed).toBeFalsy();
  });

  it('#insertMany', async () => {
    await service.insertMany(data1);
    const result = await service.count();
    expect(result).toBe(3);
  });

  it('#updateOne', async () => {
    await service.insertMany(data1);
    await service.updateOne('t-2', {
      'name': 'replaced'
    });
    const result = await service.find('t-2');
    expect(result._id).toBe('t-2');
    expect(result.name).toBe('replaced');
  });

  it('#updateMany', async () => {
    await service.insertMany(data1);
    const cnt = await service.updateMany({'_id': {'$eq': 't-2'}}, {'name': 'patched'});
    expect(cnt).toBe(1);
    const result = await service.find('t-2');
    expect(result.name).toBe('patched');
  });

  it('#removeOne', async () => {
    await service.insertMany(data1);
    await service.removeOne('t-2');
    const result = await service.find('t-2');
    expect(!!result).toBeFalsy();
  });

  it('#removeMany', async () => {
    await service.insertMany(data1);
    const result = await service.removeMany({ '_id': {'$eq': 't-2'}});
    expect(result).toBe(1);
    const cnt = await service.count();
    expect(cnt).toBe(2);
  });

  it('#findMany', async () => {
    await service.insertMany(data1);
    const result = await service.findMany();
    expect(result.length).toBe(3);
  });

  it('#findMany with query', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {'name': {'$eq': 'task-1'}}, limit: 10, skip: 0});
    expect(result.length).toBe(1);
  });

  it('#findMany with sort', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 1, sort: {'name': -1}});
    expect(result[0].name).toBe('task-2');
  });

  it('#findMany with projection', async () => {
    await service.insertMany(data1);
    const result = await service.findMany({'where': {}, limit: 1, skip: 0}, {'projection': {'completed': 1}});
    expect(typeof result[0]['name']).toBe('undefined');
  });

  it('#count with no limit', async () => {
    const projectService = injector.get(PROJECT_SERVICE);
    const result = await projectService.count();
    expect(result).toBe(0);
  });

  it('#count with query and limit', async () => {
    await service.insertMany(data1);
    const result = await service.count({'name': {'$eq': 'task-1'}});
    expect(result).toBe(1);
  });

  it('#count with query', async () => {
    await service.insertMany(data1);
    const result = await service.count({'name': {'$eq': 'task-1'}});
    expect(result).toBe(1);
  });

  it('#findOne', async () => {
    await service.insertMany(data1);
    const result = await service.findOne({'name': {'$eq': 'task-1'}});
    expect(result.name).toBe('task-1');
  });
});
