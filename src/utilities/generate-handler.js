function generateHandler(controller) {
  return async function (ctx, next) {
    const results = await controller(ctx);
    ctx.body = results && results.body;
    ctx.status = results && results.status || 200;
    await next(ctx);
  };
}

module.exports = generateHandler;