import 'reflect-metadata';
import {describe, expect, it, beforeAll, afterAll, beforeEach, afterEach} from '@jest/globals';
import {Application, CommandManager} from '@rxstack/core';
import {MONGOOSE_SERVICE_OPTIONS} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {Connection} from 'mongoose';

function wait(milliseconds: number): Promise<unknown> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe('Console:Commands', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let conn: Connection;

  beforeAll(async () => {
    await app.run();
    conn = app.getInjector().get(Connection);
  });

  afterAll(async() =>  {
    await conn.close();
    await wait(1000);
  });

  beforeEach(async () => {
    await conn.dropDatabase();
    await wait(2000);
  });

  it('should sync indexes', async () => {
    await conn.dropDatabase();
    const beforeColl = await conn.db.listCollections().toArray();
    expect(beforeColl.length).toBe(0);
    const command = app.getInjector().get(CommandManager).getCommand('mongoose:ensure-indexes');
    await command.handler({});
    const afterColl = await conn.db.listCollections().toArray();
    expect(afterColl.length).toBe(2);
  });

  it('should drop database', async () => {
    await conn.dropDatabase();
    await conn.model('Task').ensureIndexes();
    const beforeColl = await conn.db.listCollections().toArray();
    expect(beforeColl.length).toBe(1);
    const command = app.getInjector().get(CommandManager).getCommand('mongoose:drop');
    await command.handler({});
    const afterColl = await conn.db.listCollections().toArray();
    expect(afterColl.length).toBe(0);
  });
});
