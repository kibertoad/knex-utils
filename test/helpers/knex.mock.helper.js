'use strict';

class MockKnex {
  constructor() {
    this.catchBlock = (e) => {
      throw e;
    };
  }

  select() {
    return this;
  }

  del() {
    return this;
  }

  raw() {
    return this;
  }

  update() {
    return this;
  }

  from() {
    return this;
  }

  leftJoin() {
    return this;
  }

  where() {
    return this;
  }

  count() {
    return this;
  }

  whereIn() {
    return this;
  }

  orderBy() {
    return this;
  }

  limit() {
    return this;
  }

  offset() {
    return this;
  }

  catch(catchBlock) {
    this.catchBlock = catchBlock;
    return this;
  }
}

class ThrowingMockKnex extends MockKnex {
  then() {
    let result = new Promise((resolve, reject) => {
      throw new Error('Stub exception');
    }).catch(this.catchBlock);

    return result;
  }
}

class ResolvingMockKnex extends MockKnex {
  then(fn) {
    let result = new Promise((resolve, reject) => {
      resolve(true);
    })
      .then(() => fn())
      .catch(this.catchBlock);

    return result;
  }
}

function initKnexStubs(sinon, knex, mockKnex) {
  const mockKnexFn = () => mockKnex;

  sinon.stub(knex, 'select').callsFake(mockKnexFn);
  sinon.stub(knex, 'del').callsFake(mockKnexFn);
  sinon.stub(knex, 'update').callsFake(mockKnexFn);
  sinon.stub(knex, 'where').callsFake(mockKnexFn);
  sinon.stub(knex, 'from').callsFake(mockKnexFn);
  sinon.stub(knex, 'raw').callsFake(mockKnexFn);
}

/**
 *
 * @param sinon
 * @param knex - instance of real knex
 */
function stubKnexToThrow(sinon, knex) {
  initKnexStubs(sinon, knex, new ThrowingMockKnex());
}

/**
 *
 * @param sinon
 * @param knex - instance of real knex
 */
function stubKnexToResolve(sinon, knex) {
  initKnexStubs(sinon, knex, new ResolvingMockKnex());
}

module.exports = {
  stubKnexToThrow, stubKnexToResolve, ThrowingMockKnex, ResolvingMockKnex
};
