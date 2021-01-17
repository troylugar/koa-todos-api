let pino, koaPino, config;

describe('logging', () => {
  beforeEach(() => {
    jest.mock('pino');
    jest.mock('koa-pino-logger');
    jest.mock('../helpers/config');
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should set pass prod options when NODE_ENV=production', done  => {
    jest.isolateModules(() => {
      pino = require('pino');
      koaPino = require('koa-pino-logger');
      config = require('../helpers/config');
      config.NODE_ENV = 'production';
      const { requestLogger } = require('./logger');
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
      config = require('../helpers/config');
      delete config.NODE_ENV;
      const { requestLogger } = require('./logger');
      requestLogger();
      expect(pino).toHaveBeenCalledWith(devOpts);
      expect(koaPino).toHaveBeenCalledWith(devOpts);
      done();
    });
  });
});