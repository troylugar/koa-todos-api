const generateHandler = require('./generate-handler');

it('should pass context to controller', async done => {
  const ctx = { test: 'asdf' };
  const testController = jest.fn();
  const next = jest.fn();
  const handler = generateHandler(testController);
  await handler(ctx, next);
  expect(testController).toHaveBeenCalledWith(ctx);
  expect(next).toHaveBeenCalledWith(ctx);
  done();
});

it('should map results back to context', async done => {
  const body = 'I\'m a little tea pot.';
  const status = 418;
  const ctx = {};
  const testController = jest.fn(() => ({ body, status }));
  const next = jest.fn();
  const handler = generateHandler(testController);
  await handler(ctx, next);
  expect(ctx.body).toBe(body);
  expect(ctx.status).toBe(status);
  expect(next).toHaveBeenCalledWith(ctx);
  done();
});

it('should default status to 200', async done => {
  const body = 'successful';
  const ctx = {};
  const testController = jest.fn(() => ({ body }));
  const next = jest.fn();
  const handler = generateHandler(testController);
  await handler(ctx, next);
  expect(ctx.body).toBe(body);
  expect(ctx.status).toBe(200);
  expect(next).toHaveBeenCalledWith(ctx);
  done();
});

it('should allow errors to bubble up', async done => {
  const error = new Error('asdf');
  const ctx = {};
  const testController = jest.fn(() => { throw error; });
  const handler = generateHandler(testController);
  await expect(handler(ctx)).rejects.toThrowError(error);
  done();
});