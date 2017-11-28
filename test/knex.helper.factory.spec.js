'use strict';

const factory = require('../src/knex.helper.factory');
const KnexHelper = require('../src/knex.helper');
const dbConfig = require('../src/db-config');
const { expect } = require('chai');
const sinon = require('sinon');
const knexMockHelper = require('./helpers/knex.mock.helper');

// ToDo fix this later
describe.skip('DB utils: knex factory', () => {
  beforeEach((done) => {
    const mockedKnex = new knexMockHelper.ResolvingMockKnex();
    mockedKnex.destroy = sinon.spy();
    dbConfig.setConfig({});

    global.sinon = sinon.sandbox.create();
    global.sinon.stub(KnexHelper.prototype, '_initKnexConnection').returns(mockedKnex);
    done();
  });

  afterEach((done) => {
    global.sinon.restore();
    done();
  });

  it('should return knex helper instance', () => {
    expect(factory.getInstance({})).to.be.an.instanceOf(KnexHelper);
  });
});
