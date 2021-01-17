const mongoose = require('mongoose');
const Schema = mongoose.Schema;
jest.mock('../middleware/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));
const { logger } = require('../middleware/logger');
const {
  generateRepositoryHandlers,
  registerHandlersToDefaultRoutes
} = require('./generate-repository');

const schema = new Schema({ title: String });
const testModel = mongoose.model('Item', schema);

describe('generateRepositoryHandlers', () => {
  describe('find', () => {
    const fakeModel = { ...testModel };
    const ctx = {
      throw: jest.fn()
    };

    describe('successful behavior', () => {
      const handlers = generateRepositoryHandlers(fakeModel);
      const results = [
        { title: 'First' },
        { title: 'Second' }
      ];

      beforeAll(async () => {
        fakeModel.find = jest.fn(() => results);
        await handlers.find(ctx);
      });

      it('should return a list of models', () => {
        expect(ctx.body).toBe(results);
      });

      it('should return a 200 status code', () => {
        expect(ctx.status).toBe(200);
      });

      it('should log results in info', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'find',
          result: results
        };
        const msg = `${fakeModel.modelName}.${log.action}()`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });

    describe('error behavior', () => {
      const mongoError = new Error('mongo error');
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        fakeModel.find = jest.fn(() => {
          throw mongoError;
        });
        await handlers.find(ctx);
      });

      it('should log mongo errors', () => {
        expect(logger.error).toHaveBeenCalledWith(mongoError);
      });

      it('should pass mongo errors to the context', () => {
        expect(ctx.throw).toHaveBeenCalledWith(mongoError.message);
      });

      it('should still log info when there is an error', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'find',
          result: null
        };
        const msg = `${fakeModel.modelName}.${log.action}()`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });
  });

  describe('findById', () => {
    const fakeModel = { ...testModel };
    describe('successful behavior', () => {
      const ctx = {
        params: {
          id: 1234
        },
        throw: jest.fn()
      };
      const handlers = generateRepositoryHandlers(fakeModel);
      const results = { title: 'First' };

      beforeAll(async () => {
        fakeModel.findById = jest.fn(() => results);
        await handlers.findById(ctx);
      });

      it('should return a model', () => {
        expect(ctx.body).toBe(results);
      });

      it('should return a 200 status code if model is found', () => {
        expect(ctx.status).toBe(200);
      });

      it('should return a 404 status code if model is not found', async done => {
        fakeModel.findById = jest.fn(() => null);
        await handlers.findById(ctx);
        expect(ctx.status).toBe(404);
        done();
      });

      it('should log results in info', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findById',
          params: ctx.params,
          result: results
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });

    describe('error behavior', () => {
      const ctx = {
        params: {
          id: 1234
        },
        throw: jest.fn()
      };
      const mongoError = new Error('mongo error');
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        fakeModel.findById = jest.fn(() => {
          throw mongoError;
        });
        await handlers.findById(ctx);
      });

      it('should log mongo errors', () => {
        expect(logger.error).toHaveBeenCalledWith(mongoError);
      });

      it('should pass mongo errors to the context', () => {
        expect(ctx.throw).toHaveBeenCalledWith(mongoError.message);
      });

      it('should still log info when there is an error', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findById',
          params: ctx.params,
          result: null
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });
  });

  describe('save', () => {
    const ctx = {
      request: {
        body: {
          title: 'this is the title'
        }
      },
      throw: jest.fn()
    };
    describe('successful behavior', () => {
      const fakeModel = jest.fn().mockImplementation(body => ({
        save: jest.fn(() => body)
      }));
      const handlers = generateRepositoryHandlers(fakeModel);
      const results = { ...ctx.request.body };

      beforeAll(async () => {
        await handlers.save(ctx);
      });

      it('should return a model', () => {
        expect(ctx.body).toStrictEqual(results);
      });

      it('should return a 201 status code', () => {
        expect(ctx.status).toBe(201);
      });

      it('should log results in info', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'save',
          request: ctx.request.body,
          result: results
        };
        const msg = `${fakeModel.modelName}.${log.action}()`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });

    describe('error behavior', () => {
      const mongoError = new Error('mongo error');
      const fakeModel = jest.fn().mockImplementation(() => ({
        save: jest.fn(() => { throw mongoError; })
      }));
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        await handlers.save(ctx);
      });

      it('should log mongo errors', () => {
        expect(logger.error).toHaveBeenCalledWith(mongoError);
      });

      it('should pass mongo errors to the context', () => {
        expect(ctx.throw).toHaveBeenCalledWith(mongoError.message);
      });

      it('should still log info when there is an error', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'save',
          request: ctx.request.body,
          result: null
        };
        const msg = `${fakeModel.modelName}.${log.action}()`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });
  });

  describe('findByIdAndUpdate', () => {
    const ctx = {
      params: {
        id: 1234
      },
      request: {
        body: {
          title: 'this is the title'
        }
      },
      throw: jest.fn()
    };

    describe('successful behavior', () => {
      const fakeModel = jest.fn();
      fakeModel.findByIdAndUpdate = jest.fn();
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        await handlers.findByIdAndUpdate(ctx);
      });

      it('should return a 201 status code', () => {
        expect(ctx.status).toBe(204);
      });

      it('should log results in info', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findByIdAndUpdate',
          params: ctx.params,
          request: ctx.request.body,
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });

    describe('error behavior', () => {
      const mongoError = new Error('mongo error');
      const fakeModel = jest.fn();
      fakeModel.findByIdAndUpdate = jest.fn(() => {
        throw mongoError;
      });
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        await handlers.findByIdAndUpdate(ctx);
      });

      it('should log mongo errors', () => {
        expect(logger.error).toHaveBeenCalledWith(mongoError);
      });

      it('should pass mongo errors to the context', () => {
        expect(ctx.throw).toHaveBeenCalledWith(mongoError.message);
      });

      it('should still log info when there is an error', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findByIdAndUpdate',
          params: ctx.params,
          request: ctx.request.body
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });
  });

  describe('findByIdAndDelete', () => {
    const ctx = {
      params: {
        id: 1234
      },
      throw: jest.fn()
    };

    describe('successful behavior', () => {
      const fakeModel = jest.fn();
      fakeModel.findByIdAndDelete = jest.fn();
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        await handlers.findByIdAndDelete(ctx);
      });

      it('should return a 201 status code', () => {
        expect(ctx.status).toBe(204);
      });

      it('should log results in info', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findByIdAndDelete',
          params: ctx.params
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });

    describe('error behavior', () => {
      const mongoError = new Error('mongo error');
      const fakeModel = jest.fn();
      fakeModel.findByIdAndDelete = jest.fn(() => {
        throw mongoError;
      });
      const handlers = generateRepositoryHandlers(fakeModel);

      beforeAll(async () => {
        await handlers.findByIdAndDelete(ctx);
      });

      it('should log mongo errors', () => {
        expect(logger.error).toHaveBeenCalledWith(mongoError);
      });

      it('should pass mongo errors to the context', () => {
        expect(ctx.throw).toHaveBeenCalledWith(mongoError.message);
      });

      it('should still log info when there is an error', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findByIdAndDelete',
          params: ctx.params
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });
  });
});

describe('registerHandlersToDefaultRoutes', () => {
  let handlers, fakeRouter;

  beforeAll(() => {
    handlers = generateRepositoryHandlers(testModel);
    fakeRouter = {
      get: jest.fn(() => fakeRouter),
      post: jest.fn(() => fakeRouter),
      patch: jest.fn(() => fakeRouter),
      delete: jest.fn(() => fakeRouter),
    };

    registerHandlersToDefaultRoutes(fakeRouter, handlers);
  });

  it('should route GET / to handlers.find', () => {
    expect(fakeRouter.get).toHaveBeenCalledTimes(2);
    expect(fakeRouter.get).toHaveBeenCalledWith('/', handlers.find);
  });

  it('should route GET /:id to handlers.findById', () => {
    expect(fakeRouter.get).toHaveBeenCalledTimes(2);
    expect(fakeRouter.get).toHaveBeenCalledWith('/:id', handlers.findById);
  });

  it('should route POST / to handlers.save', () => {
    expect(fakeRouter.post).toHaveBeenCalledTimes(1);
    expect(fakeRouter.post).toHaveBeenCalledWith('/', handlers.save);
  });

  it('should route PATCH /:id to handlers.findByIdAndUpdate', () => {
    expect(fakeRouter.patch).toHaveBeenCalledTimes(1);
    expect(fakeRouter.patch).toHaveBeenCalledWith('/:id', handlers.findByIdAndUpdate);
  });

  it('should route DELETE /:id to handlers.save', () => {
    expect(fakeRouter.delete).toHaveBeenCalledTimes(1);
    expect(fakeRouter.delete).toHaveBeenCalledWith('/:id', handlers.findByIdAndDelete);
  });
});
