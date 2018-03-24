const heartbeatUtils = require('../../lib/heartbeat.utils');

const { assert } = require('chai');
const knexMockHelper = require('../helpers/knex.mock.helper');
require('../helpers/test.bootstrap');

describe('heartbeat.utils', () => {
  it('Get a DB error while connecting', async () => {
    const knex = new knexMockHelper.ThrowingMockKnex();
    const checkResult = await heartbeatUtils.checkHeartbeat(knex);
    assert.equal(checkResult.isOk, false);
    assert.equal(checkResult.error.message, 'Stub exception');
  });

  it('Do not get a DB error while connecting', async () => {
    const knex = new knexMockHelper.ResolvingMockKnex();
    const checkResult = await heartbeatUtils.checkHeartbeat(knex);
    assert.deepEqual(checkResult, {
      isOk: true
    });
  });
});
