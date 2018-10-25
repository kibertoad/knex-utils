const { assert } = require('chai');
const { addAndWhere, addAndWhereDate } = require('../../lib/query.utils');
const { getKnexStub } = require('../helpers/knex.mock.helper');

const sinon = require('sinon');
const sandbox = sinon.createSandbox();

describe('queryUtils', () => {
  let knex;
  beforeEach(() => {
    knex = getKnexStub(sandbox);
  });
  afterEach(() => {
    sandbox.restore();
  });

  describe('addAndWhereDate', () => {
    it('should call whereBetween when both from and to are set', () => {
      addAndWhereDate(knex, 'createdAt', '2017', '2018');
      assert.deepEqual(knex.whereBetween.args[0], ['createdAt', ['2017', '2018']]);
    });

    it('should call andWhere when only from is set', () => {
      addAndWhereDate(knex, 'createdAt', '2017');
      assert.deepEqual(knex.andWhere.args[0], ['createdAt', '>=', '2017']);
    });

    it('should call andWhere when only to is set', () => {
      addAndWhereDate(knex, 'createdAt', null, '2018');
      assert.deepEqual(knex.andWhere.args[0], ['createdAt', '<=', '2018']);
    });

    it("shouldn't call any methods when neither from or to are set", () => {
      addAndWhereDate(knex, 'createdAt');
      assert.equal(knex.andWhere.callCount, 0);
      assert.equal(knex.whereBetween.callCount, 0);
    });
  });

  describe('addAndWhere', () => {
    it('should work for sets', () => {
      const data = [1, 2];

      addAndWhere(knex, 'column', new Set(data));

      assert.deepEqual(knex.whereIn.args[0], ['column', data]);
    });

    it('should work for arrays', () => {
      const data = [1, 2];

      addAndWhere(knex, 'column', data);

      assert.deepEqual(knex.whereIn.args[0], ['column', data]);
    });

    it('should work for other value types', () => {
      const data = 'foobar';

      addAndWhere(knex, 'column', data);

      assert.deepEqual(knex.where.args[0], ['column', data]);
    });
  });
});
