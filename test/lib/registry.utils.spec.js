const registryUtils = require('../../lib/registry.utils');

const { assert } = require('chai');
const knexMockHelper = require('../helpers/knex.mock.helper');
require('../helpers/test.bootstrap');

describe('registry.utils', () => {
  it('closeAllInstances - happy path', async () => {
    const knex = new knexMockHelper.ResolvingMockKnex();
    registryUtils.registerKnexInstance(knex);
    const errors = await registryUtils.closeAllInstances();
    assert.equal(errors.length, 0);
    assert.equal(registryUtils.getRegistry().length, 0);
  });

  it('closeAllInstances - one of knex instances throws', async () => {
    const invalidKnex = new knexMockHelper.ThrowingMockKnex();
    const correctKnex = new knexMockHelper.ResolvingMockKnex();

    registryUtils.registerKnexInstance(invalidKnex);
    registryUtils.registerKnexInstance(correctKnex);
    const errors = await registryUtils.closeAllInstances();
    assert.equal(errors.length, 1);
    assert.equal(registryUtils.getRegistry().length, 0);
    const [error] = errors;
    assert.equal(error.cause.message, 'Stub destroy exception');
    assert.isDefined(error.knex);
  });

  it('logAllErrors - happy path', async () => {
    const errors = [{
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
    }];
    const loggerMock = global.sinon.mock(console);
    loggerMock.expects('error')
      .exactly(1)
      .withArgs('Failed to close DB connection (postgres@localhost:dbName): ', { message: 'error message' });
    registryUtils.logAllClosingErrors(errors, loggerMock.object);

    loggerMock.verify();
  });
});
