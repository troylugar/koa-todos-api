afterEach(() => {
  jest.resetModules();
});

it('should pass in devOpts when node_env is production', () => {
  const config = {};
  jest.mock('koa-pino-logger', () => jest.fn());
  jest.mock('../utilities/config', () => config);
  const pinoKoa = require('koa-pino-logger');
  require('./request-logger')();
  expect(pinoKoa).toHaveBeenCalledWith({prettyPrint: true});
});

it('should pass in empty object when node_env is not production', () => {
  const config = { node_env: 'production' };
  jest.mock('koa-pino-logger', () => jest.fn());
  jest.mock('../utilities/config', () => config);
  const pinoKoa = require('koa-pino-logger');
  require('./request-logger')();
  expect(pinoKoa).toHaveBeenCalledWith({});
});