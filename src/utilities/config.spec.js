describe('config', () => {
  let dotenv;

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
      require('./config');
      expect(dotenv.config).not.toHaveBeenCalled();
    });

    it('should load dotenv when NODE_ENV != production', () => {
      process.env.NODE_ENV = undefined;
      require('./config');
      expect(dotenv.config).toHaveBeenCalled();
    });
  });

  describe('config values mapped correctly', () => {
    it('should map config.port to environment variable', () => {
      const port = 9000;
      process.env.PORT = port;
      const config = require('./config');
      expect(config.port).toBe(port);
    });
  });
});