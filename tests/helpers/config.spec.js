const theoretically = require('jest-theories').default;
let dotenv;

describe('config', () => {
  beforeEach(() => {
    jest.mock('dotenv');
    dotenv = require('dotenv');
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('config changes based on NODE_ENV', () => {
    it('should NOT load dotenv when NODE_ENV=production', () => {
      process.env.NODE_ENV = 'production';
      require('../../src/helpers/config');
      expect(dotenv.config).not.toHaveBeenCalled();
    });

    it('should load dotenv when NODE_ENV != production', () => {
      process.env.NODE_ENV = undefined;
      require('../../src/helpers/config');
      expect(dotenv.config).toHaveBeenCalled();
    });
  });

  describe('config values mapped correctly', () => {
    const ports = [3000, 4000, 5000];
    theoretically('should match config.port to PORT environment variable', ports, port => {
      process.env.PORT = port;
      const config = require('../../src/helpers/config');
      expect(config.port).toBe(port);
    });
  });
});