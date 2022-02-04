import 'reflect-metadata';
import {Application, CommandManager} from '@rxstack/core';
import {MONGOOSE_SERVICE_OPTIONS} from './mocks/MONGOOSE_SERVICE_OPTIONS';
import {Connection} from 'mongoose';

describe('Console:Commands', () => {
  // Setup application
  const app = new Application(MONGOOSE_SERVICE_OPTIONS);
  let conn: Connection;

  before(async () => {
    await app.run();
    conn = app.getInjector().get(Connection);
  });

  beforeEach(async () => {
    await conn.dropDatabase();
  });

  it('should sync indexes', async () => {
    await conn.dropDatabase();
    const beforeColl = await conn.db.listCollections().toArray();
    beforeColl.length.should.be.equal(0);
    const command = app.getInjector().get(CommandManager).getCommand('mongoose:ensure-indexes');
    await command.handler({});
    const afterColl = await conn.db.listCollections().toArray();
    afterColl.length.should.be.equal(2);
  });

  it('should drop database', async () => {
    await conn.model('Task').ensureIndexes();
    const beforeColl = await conn.db.listCollections().toArray();
    beforeColl.length.should.be.equal(1);
    const command = app.getInjector().get(CommandManager).getCommand('mongoose:drop');
    await command.handler({});
    const afterColl = await conn.db.listCollections().toArray();
    afterColl.length.should.be.equal(0);
  });
});
