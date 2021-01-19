let pino, koaPino, config;

describe('logging', () => {
  beforeEach(() => {
    jest.mock('pino');
    jest.mock('koa-pino-logger');
    jest.mock('../../src/helpers/config');
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should set pass prod options when NODE_ENV=production', done  => {
    jest.isolateModules(() => {
      pino = require('pino');
      koaPino = require('koa-pino-logger');
      config = require('../../src/helpers/config');
      config.node_env = 'production';
      const { requestLogger } = require('../../src/middleware/logger');
      requestLogger();
      expect(pino).toHaveBeenCalledWith({});
      expect(koaPino).toHaveBeenCalledWith({});
      done();
    });
  });

  it('should set pass dev options when NODE_ENV != production', done  => {
    jest.isolateModules(() => {
      const devOpts = {prettyPrint: true};
      pino = require('pino');
      koaPino = require('koa-pino-logger');
      config = require('../../src/helpers/config');
      delete config.node_env;
      const { requestLogger } = require('../../src/middleware/logger');
      requestLogger();
      expect(pino).toHaveBeenCalledWith(devOpts);
      expect(koaPino).toHaveBeenCalledWith(devOpts);
      done();
    });
  });
});