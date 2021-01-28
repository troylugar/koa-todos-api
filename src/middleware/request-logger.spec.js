const pinoKoa = require('koa-pino-logger');
jest.mock('koa-pino-logger');

afterEach(() => {
  jest.resetAllMocks();
});

it('should pass in devOpts when node_env is not production', () => {
  jest.mock('../utilities/config', () => ({}));
  jest.isolateModules(() => {
    require('./request-logger')();
    expect(pinoKoa).toHaveBeenCalledWith({ prettyPrint: true });
  });
});

it('should pass in empty object when node_env is production', () => {
  jest.mock('../utilities/config', () => ({ node_env: 'production' }));
  jest.isolateModules(() => {
    require('./request-logger')();
    expect(pinoKoa).toHaveBeenCalledWith({});
  });
});
