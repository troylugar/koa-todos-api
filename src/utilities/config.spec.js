const dotenv = require('dotenv');
jest.mock('dotenv');

afterEach(() => {
  jest.resetAllMocks();
});

describe('config changes based on NODE_ENV', () => {
  it('should NOT load dotenv when NODE_ENV=production', () => {
    process.env.NODE_ENV = 'production';
    jest.isolateModules(() => {
      require('./config');
      expect(dotenv.config).not.toHaveBeenCalled();
    });
  });

  it('should load dotenv when NODE_ENV != production', () => {
    process.env.NODE_ENV = undefined;
    jest.isolateModules(() => {
      require('./config');
      expect(dotenv.config).toHaveBeenCalled();
    });
  });
});

describe('config values mapped correctly', () => {
  it('should map config.port to environment variable', () => {
    const port = 9000;
    jest.isolateModules(() => {
      process.env.PORT = port;
      const config = require('./config');
      expect(config.port).toBe(port);
    });
  });
});