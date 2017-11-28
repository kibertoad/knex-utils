'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const knexMockHelper = require('./helpers/knex.mock.helper');
const KnexHelper = require('../src/knex.helper');
const dummyLogger = require('./helpers/dummyLogger');

describe('Knex helper', () => {
  const testConfig = {
    client: 'dummy',
    connection: {
      host: 'dummy',
      user: 'dummy',
      password: 'dummy',
      database: 'dummy',
    },

    acquireConnectionTimeout: 1000,
    pool: {
      min: 1,
      max: 1
    }
  };

  beforeEach((done) => {
    global.sinon = sinon.sandbox.create();
    done();
  });

  afterEach((done) => {
    global.sinon.restore();
    done();
  });

  it('Get a DB error while connecting', (done) => {
    process.prependOnceListener('unhandledRejection', (e) => {
      expect(e.message).to.equal('DB has failed heartbeat check');
      done();
    });

    global.sinon.stub(KnexHelper.prototype, '_initKnexConnection').returns(new knexMockHelper.ThrowingMockKnex());
    const knexHelper = new KnexHelper(testConfig, dummyLogger);
    knexHelper.getKnexInstance();
  });

  it('Do not get a DB error while connecting', (done) => {
    process.prependOnceListener('unhandledRejection', expect.fail);

    global.sinon.stub(KnexHelper.prototype, '_initKnexConnection').returns(new knexMockHelper.ResolvingMockKnex());

    global.sinon.stub(dummyLogger, 'info').callsFake((message) => {
      expect(message).to.equal('DB heartbeat is OK.');
      done();
    });

    const knexHelper = new KnexHelper(testConfig, dummyLogger);
    knexHelper.getKnexInstance();
  });
});

