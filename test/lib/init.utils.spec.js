const heartbeatUtils = require('../../lib/heartbeat.utils');
const initUtils = require('../../lib/init.utils');

const TEST_CONFIG = require('../helpers/test.config');
const { assert } = require('chai');
const knexMockHelper = require('../helpers/knex.mock.helper');
require('../helpers/test.bootstrap');

describe('init.utils', () => {
  it('getKnexInstance - happy path', () => {
    const initStub = global.sinon.stub(initUtils, '_initKnexInstance')
      .callsFake(() => {
        return new knexMockHelper.ResolvingMockKnex();
      });

    const knex = initUtils.getKnexInstance(TEST_CONFIG);
    assert.equal(initStub.callCount, 1);
    assert.instanceOf(knex, knexMockHelper.ResolvingMockKnex);
  });
});
