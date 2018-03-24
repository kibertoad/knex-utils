const sinon = require('sinon');

beforeEach(() => {
  global.sinon = sinon.sandbox.create();
});

afterEach(() => {
  global.sinon.restore();
});
