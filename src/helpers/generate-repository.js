const { logger } = require('../middleware/logger');

/**
 * @async
 * @typedef {Function} AsyncKoaHandler
 * @param {import('koa').Context} ctx
 * @returns {Promise}
 */

/**
 * @typedef {Object} RepositoryHandlers
 * @property {AsyncKoaHandler} find - finds all models
 * @property {AsyncKoaHandler} findById - finds a model by id
 * @property {AsyncKoaHandler} save - saves a new model
 * @property {AsyncKoaHandler} findByIdAndUpdate - updates a model by id
 * @property {AsyncKoaHandler} findByIdAndDelete - deletes a model by id
 */

/**
 * Generates CRUD routes for the given model
 * 
 * @param {import('mongoose').Document} model
 * @returns {RepositoryHandlers}
 */
module.exports.generateRepositoryHandlers = (model) => {
  const baseLog = {
    model: model.modelName,
    result: null
  };

  return {
    /** @type {AsyncKoaHandler} */
    find: async (ctx) => {
      const log = {
        ...baseLog,
        action: 'find'
      };

      try {
        const result = await model.find({});
        log.result = result;
        ctx.body = result;
        ctx.status = 200;
      } catch (error) {
        ctx.throw(error.message);
        logger.error(error);
      } finally {
        const msg = `${log.model}.${log.action}()`;
        logger.info(log, msg);
      }
    },

    /** @type {AsyncKoaHandler} */
    findById: async (ctx) => {
      /** 
       * @todo type definition should show ctx.params.id as required
       */
      const { id } = ctx.params;
      const log = {
        ...baseLog,
        action: 'findById',
        params: ctx.params
      };

      try {
        const result = await model.findById(id);
        log.result = result;
        if (result === null) {
          ctx.status = 404;
        } else {
          ctx.body = result;
          ctx.status = 200;
        }
      } catch (error) {
        ctx.throw(error.message);
        logger.error(error);
      } finally {
        const msg = `${log.model}.${log.action}(${log.params.id})`;
        logger.info(log, msg);
      }
    },

    /** @type {AsyncKoaHandler} */
    save: async (ctx) => {
      const { body } = ctx.request;
      const log = {
        ...baseLog,
        action: 'save',
        request: body
      };

      try {
        const entity = new model(body);
        const result = await entity.save();
        log.result = result;
        ctx.body = result;
        ctx.status = 201;
      } catch (error) {
        ctx.throw(error.message);
        logger.error(error);
      } finally {
        const msg = `${log.model}.${log.action}()`;
        logger.info(log, msg);
      }
    },

    /** @type {AsyncKoaHandler} */
    findByIdAndUpdate: async (ctx) => {
      const { id } = ctx.params;
      const { body } = ctx.request;
      const log = {
        ...baseLog,
        action: 'findByIdAndUpdate',
        request: body,
        params: ctx.params
      };

      try {
        const result = await model.findByIdAndUpdate(id, body);
        log.result = result;
        ctx.status = (result === null) ? 404 : 204;
      } catch (error) {
        ctx.throw(error.message);
        logger.error(error);
      } finally {
        const msg = `${log.model}.${log.action}(${log.params.id})`;
        logger.info(log, msg);
      }
    },

    /** @type {AsyncKoaHandler} */
    findByIdAndDelete: async (ctx) => {
      const { id } = ctx.params;
      const log = {
        ...baseLog,
        action: 'findByIdAndDelete',
        params: ctx.params
      };

      try {
        const result = await model.findByIdAndDelete(id);
        log.result = result;
        ctx.status = (result === null) ? 404 : 204;
      } catch (error) {
        ctx.throw(error.message);
        logger.error(error);
      } finally {
        const msg = `${log.model}.${log.action}(${log.params.id})`;
        logger.info(log, msg);
      }
    }
  };
};

/**
 * Attaches handlers to their default routes
 * @param {import('koa-router')} router 
 * @param {RepositoryHandlers} handlers 
 * @returns {void}
 */
module.exports.registerHandlersToDefaultRoutes = (router, handlers) =>
  router
    .get('/', handlers.find)
    .post('/', handlers.save)
    .get('/:id', handlers.findById)
    .patch('/:id', handlers.findByIdAndUpdate)
    .delete('/:id', handlers.findByIdAndDelete);
