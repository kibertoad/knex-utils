const connectionUtils = require('../../lib/connection.utils');

const TEST_CONFIG = require('../helpers/test.config');
const { assert } = require('chai');
const knexMockHelper = require('../helpers/knex.mock.helper');
require('../helpers/test.bootstrap');

describe('connection.utils', () => {
  it('getKnexInstance - happy path', () => {
    const initStub = global.sinon.stub(connectionUtils, '_initKnexInstance').callsFake(() => {
      return new knexMockHelper.ResolvingMockKnex();
    });
    const registerStub = global.sinon.stub(connectionUtils, 'registerKnexInstance');

    const knex = connectionUtils.getKnexInstance(TEST_CONFIG);

    assert.equal(initStub.callCount, 1);
    assert.equal(registerStub.callCount, 1);
    assert.instanceOf(knex, knexMockHelper.ResolvingMockKnex);
  });

  it('closeAllInstances - happy path', () => {
    const knex = new knexMockHelper.ResolvingMockKnex();
    connectionUtils.registerKnexInstance(knex);
    return connectionUtils.closeAllInstances().then(errors => {
      assert.equal(errors.length, 0);
      assert.equal(connectionUtils.getRegistry().length, 0);
    });
  });

  it('closeAllInstances - one of knex instances throws', () => {
    const invalidKnex = new knexMockHelper.ThrowingMockKnex();
    const correctKnex = new knexMockHelper.ResolvingMockKnex();

    connectionUtils.registerKnexInstance(invalidKnex);
    connectionUtils.registerKnexInstance(correctKnex);
    return connectionUtils.closeAllInstances().then(errors => {
      assert.equal(errors.length, 1);
      assert.equal(connectionUtils.getRegistry().length, 0);
      const [error] = errors;
      assert.equal(error.cause.message, 'Stub destroy exception');
      assert.isDefined(error.knex);
    });
  });

  it('logAllErrors - happy path', () => {
    const errors = [
      {
        knex: {
          client: {
            config: {
              client: 'postgres',
              connection: {
                host: 'localhost',
                user: 'postgres',
                password: 'dummyPass',
                database: 'dbName'
              }
            }
          }
        },
        cause: { message: 'error message' }
      }
    ];
    const loggerMock = global.sinon.mock(console);
    loggerMock
      .expects('error')
      .exactly(1)
      .withArgs('Failed to close DB connection (postgres@localhost:dbName): ', {
        message: 'error message'
      });
    connectionUtils.logAllClosingErrors(errors, loggerMock.object);

    loggerMock.verify();
  });
});
