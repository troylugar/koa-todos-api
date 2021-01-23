function generateHandler(controller) {
  return async function (ctx) {
    const results = await controller(ctx);
    ctx.body = results && results.body;
    ctx.status = results && results.status || 200;
  };
}

module.exports = generateHandler;