afterEach(() => {
  jest.resetModules();
});

it('should pass in devOpts when node_env is production', () => {
  const config = {};
  jest.mock('pino', () => jest.fn());
  jest.mock('./config', () => config);
  const pino = require('pino');
  require('./logger');
  expect(pino).toHaveBeenCalledWith({prettyPrint: true});
});

it('should not pass in devOpts when node_env is not production', () => {
  const config = { node_env: 'production' };
  jest.mock('pino', () => jest.fn());
  jest.mock('./config', () => config);
  const pino = require('pino');
  require('./logger');
  expect(pino).toHaveBeenCalledWith({});
});