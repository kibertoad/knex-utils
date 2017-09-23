'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const tools = require('../src/tools');
const dbConfig = require('../src/db-config');
const KnexHelper = require('../src/knex.helper');
const TableCleaner = require('knex-tablecleaner');
const knexMockHelper = require('./helpers/knex.mock.helper');
const knexHelperFactory = require('../src/knex.helper.factory');

describe('DB utils tools', () => {
  const mockedKnex = new knexMockHelper.ResolvingMockKnex();

  beforeEach((done) => {
    global.sinon = sinon.sandbox.create();
    mockedKnex.destroy = sinon.spy();
    dbConfig.setConfig({});

    global.sinon.stub(KnexHelper.prototype, '_initKnexConnection').returns(mockedKnex);
    knexHelperFactory.getInstance(dbConfig.getConfig(), dbConfig.getLogger(), true); // create new instance
    done();
  });

  afterEach((done) => {
    global.sinon.restore();
    dbConfig.setConfig(undefined);
    done();
  });

  it('should validate parameters for migrateDb', () => {
    expect(tools.migrateDb).to.throw('Validated object is null or undefined');
    expect(() => tools.migrateDb('path', null)).to.throw('Validated object is null or undefined');
  });

  it('should migrate db', (done) => {
    mockedKnex.migrate = {
      latest: global.sinon.stub().returns(Promise.resolve())
    };

    tools.migrateDb('testDir', 'testTable')
      .then(done);
  });

  it('should validate parameters for seedDb', () => {
    expect(tools.seedDb).to.throw('Validated object is null or undefined');
  });

  it('should seed db', (done) => {
    mockedKnex.seed = {
      run: global.sinon.stub().returns(Promise.resolve())
    };

    tools.seedDb('testDir')
      .then(done);
  });

  it('should validate parameters for cleanDb', () => {
    expect(tools.cleanDb).to.throw('Validated object is null or undefined');
  });

  it('should clean db', (done) => {
    const expectedTableNames = ['a', 'b', 'c'];

    global.sinon.stub(TableCleaner.prototype, 'cleanTables').callsFake((knex, tableNames) => {
      expect(tableNames).to.be.equals(expectedTableNames);
      return Promise.resolve();
    });

    tools.cleanDb(expectedTableNames)
      .then(done);
  });

  it('should close connection', (done) => {
    mockedKnex.destroy = global.sinon.stub().callsFake(() => done());
    tools.closeConnection();
  });
});
