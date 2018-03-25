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

  destroy() {
    return Promise.resolve();
  }

  catch(catchBlock) {
    this.catchBlock = catchBlock;
    return this;
  }
}

class ThrowingMockKnex extends MockKnex {
  then() {
    const result = new Promise(() => {
      throw new Error('Stub exception');
    }).catch(this.catchBlock);

    return result;
  }

  destroy() {
    const result = new Promise(() => {
      throw new Error('Stub destroy exception');
    }).catch(this.catchBlock);

    return result;
  }
}

class ResolvingMockKnex extends MockKnex {
  then(fn) {
    const result = new Promise((resolve) => {
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
