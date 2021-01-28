const Router = require('@koa/router');
const generateHandler = require('./generate-handler');
const generateRouter = require('./generate-router');

jest.mock('@koa/router');
jest.mock('./generate-handler');

afterEach(() => {
  Router.mockReset();
  generateHandler.mockReset();
});

it('should call router functions based on route method', () => {
  const getRoute = { method: 'GET', path: '/', controller: jest.fn() };
  const postRoute = { method: 'POST', path: '/:id', controller: jest.fn() };
  const routes = [
    getRoute,
    postRoute
  ];

  const mockRouter = {
    get: jest.fn(),
    post: jest.fn()
  };
  const mockHandler = jest.fn();
  Router.mockImplementation(() => mockRouter);
  generateHandler.mockImplementation(() => mockHandler);

  generateRouter(routes);
  expect(generateHandler).toHaveBeenCalledWith(getRoute.controller);
  expect(mockRouter.get).toHaveBeenCalledWith(getRoute.path, mockHandler);
  expect(generateHandler).toHaveBeenCalledWith(postRoute.controller);
  expect(mockRouter.post).toHaveBeenCalledWith(postRoute.path, mockHandler);
});