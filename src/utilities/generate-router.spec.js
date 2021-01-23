require('koa-router');
const generateHandler = require('./generate-handler');
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockHandler = jest.fn();

jest.mock('koa-router', () =>
  jest.fn().mockImplementation(() => ({
    get: mockGet,
    post: mockPost
  })));

jest.mock('./generate-handler', () => {
  return jest.fn(() => {
    return mockHandler;
  });
});


it('should call router functions based on route method', () => {
  const generateRouter = require('./generate-router');
  const getRoute = { method: 'GET', path: '/', controller: jest.fn() };
  const postRoute = { method: 'POST', path: '/:id', controller: jest.fn() };
  const routes = [
    getRoute,
    postRoute
  ];
  generateRouter(routes);
  expect(generateHandler).toHaveBeenCalledWith(getRoute.controller);
  expect(mockGet).toHaveBeenCalledWith(getRoute.path, mockHandler);
  expect(generateHandler).toHaveBeenCalledWith(postRoute.controller);
  expect(mockPost).toHaveBeenCalledWith(postRoute.path, mockHandler);
});