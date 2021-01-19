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
    let ctx, fakeModel, handlers;

    beforeEach(async () => {
      ctx = {
        throw: jest.fn()
      };
      fakeModel = { ...testModel };
      handlers = generateRepositoryHandlers(fakeModel);
    });

    afterEach(() => {
      logger.info.mockClear();
    });

    describe('successful behavior', () => {
      let results;

      beforeEach(async () => {
        results = [
          { title: 'First' },
          { title: 'Second' }
        ];
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
      let mongoError;

      beforeEach(async () => {
        mongoError = new Error('mongo error');
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
    let fakeModel;

    beforeEach(() => {
      fakeModel = { ...testModel };
    });

    afterEach(() => {
      logger.info.mockClear();
    });

    describe('successful behavior', () => {
      let ctx, handlers, results;

      beforeEach(async () => {
        ctx = {
          params: {
            id: 1234
          },
          throw: jest.fn()
        };
        handlers = generateRepositoryHandlers(fakeModel);
        results = { title: 'First' };
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
      let ctx, handlers, mongoError;

      beforeEach(async () => {
        ctx = {
          params: {
            id: 1234
          },
          throw: jest.fn()
        };
        mongoError = new Error('mongo error');
        handlers = generateRepositoryHandlers(fakeModel);
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
    let ctx;
    beforeEach(async () => {
      ctx = {
        request: {
          body: {
            title: 'this is the title'
          }
        },
        throw: jest.fn()
      };
    });

    describe('successful behavior', () => {
      let fakeModel, handlers, results;

      beforeEach(async () => {
        fakeModel = jest.fn().mockImplementation(body => ({
          save: jest.fn(() => body)
        }));
        handlers = generateRepositoryHandlers(fakeModel);
        results = { ...ctx.request.body };
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
      let mongoError, fakeModel, handlers;

      beforeEach(async () => {
        mongoError = new Error('mongo error');
        fakeModel = jest.fn().mockImplementation(() => ({
          save: jest.fn(() => { throw mongoError; })
        }));
        handlers = generateRepositoryHandlers(fakeModel);
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
    let ctx;

    beforeEach(async () => {
      ctx = {
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
    });

    afterEach(() => {
      logger.info.mockClear();
    });

    describe('successful behavior', () => {
      let fakeModel, handlers;

      beforeEach(async () => {
        fakeModel = jest.fn();
        fakeModel.findByIdAndUpdate = jest.fn().mockReturnValue({});
        handlers = generateRepositoryHandlers(fakeModel);
        await handlers.findByIdAndUpdate(ctx);
      });

      it('should return an empty body when updated', () => {
        expect(ctx.body).toBeUndefined();
      });

      it('should return a 204 status code when updated', () => {
        expect(ctx.status).toBe(204);
      });

      it('should return a 404 status code when not found', async (done) => {
        fakeModel.findByIdAndUpdate = jest.fn().mockReturnValue(null);
        await handlers.findByIdAndUpdate(ctx);
        expect(ctx.status).toBe(404);
        done();
      });

      it('should log results in info', () => {
        const log = {
          model: fakeModel.modelName,
          action: 'findByIdAndUpdate',
          params: ctx.params,
          request: ctx.request.body,
          result: {}
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });

    describe('error behavior', () => {
      let mongoError, fakeModel, handlers;

      beforeEach(async () => {
        mongoError = new Error('mongo error');
        fakeModel = jest.fn();
        fakeModel.findByIdAndUpdate = jest.fn(() => {
          throw mongoError;
        });
        handlers = generateRepositoryHandlers(fakeModel);
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
          request: ctx.request.body,
          result: null
        };
        const msg = `${fakeModel.modelName}.${log.action}(${ctx.params.id})`;
        expect(logger.info).toHaveBeenCalledWith(log, msg);
      });
    });
  });

  describe('findByIdAndDelete', () => {
    let ctx;

    beforeEach(async () => {
      ctx = {
        params: {
          id: 1234
        },
        throw: jest.fn()
      };
    });

    describe('successful behavior', () => {
      let fakeModel, handlers;

      beforeEach(async () => {
        fakeModel = jest.fn();
        fakeModel.findByIdAndDelete = jest.fn();
        handlers = generateRepositoryHandlers(fakeModel);
        await handlers.findByIdAndDelete(ctx);
      });

      it('should return an empty body when updated', () => {
        expect(ctx.body).toBeUndefined();
      });
      it('should return a 204 status code when updated', () => {
        expect(ctx.status).toBe(204);
      });

      it('should return a 404 status code when not found', async (done) => {
        fakeModel.findByIdAndDelete = jest.fn().mockReturnValue(null);
        await handlers.findByIdAndDelete(ctx);
        expect(ctx.status).toBe(404);
        done();
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
      let mongoError, fakeModel, handlers;

      beforeEach(async () => {
        mongoError = new Error('mongo error');
        fakeModel = jest.fn();
        fakeModel.findByIdAndDelete = jest.fn(() => {
          throw mongoError;
        });
        handlers = generateRepositoryHandlers(fakeModel);
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
