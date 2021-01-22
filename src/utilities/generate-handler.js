function generateHandler(controller) {
  return async function (ctx) {
    try {
      const results = await controller(ctx);
      ctx.body = results.body;
      ctx.status = results.status || 200;
    } catch (error) {
      ctx.body = error;
      ctx.status = 500;
    }
  };
}

module.exports = generateHandler;