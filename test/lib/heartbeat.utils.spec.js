const heartbeatUtils = require('../../lib/heartbeat.utils');

const { assert } = require('chai');
const knexMockHelper = require('../helpers/knex.mock.helper');
require('../helpers/test.bootstrap');

describe('heartbeat.utils', () => {
  it('Get a DB error while connecting', () => {
    const knex = new knexMockHelper.ThrowingMockKnex();
    return heartbeatUtils.checkHeartbeat(knex).then(checkResult => {
      assert.equal(checkResult.isOk, false);
      assert.equal(checkResult.error.message, 'Stub exception');
    });
  });

  it('Do not get a DB error while connecting', () => {
    const knex = new knexMockHelper.ResolvingMockKnex();
    return heartbeatUtils.checkHeartbeat(knex).then(checkResult => {
      assert.deepEqual(checkResult, {
        isOk: true
      });
    });
  });
});
