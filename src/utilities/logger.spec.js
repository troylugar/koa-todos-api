const pino = require('pino');
jest.mock('pino');

afterEach(() => {
  jest.resetAllMocks();
});

it('should pass in devOpts when node_env is not production', () => {
  jest.mock('./config', () => ({}));
  jest.isolateModules(() => {
    require('./logger');
    expect(pino).toHaveBeenCalledWith({ prettyPrint: true });
  });
});

it('should not pass in devOpts when node_env is production', () => {
  jest.mock('./config', () => ({ node_env: 'production' }));
  jest.isolateModules(() => {
    require('./logger');
    expect(pino).toHaveBeenCalledWith({});
  });
});