const { todoService } = require('../../services');
const getTodos = require('./get-todos');

jest.mock('../../services');

afterEach(() => {
  jest.resetAllMocks();
});

it('should return a 200 given an array of objects', async done => {
  const expected = [{ title: 'Fake todo' }];
  todoService.list.mockImplementation(() => Promise.resolve(expected));
  const result = await getTodos();
  expect(result.body).toStrictEqual(expected);
  expect(result.status).toBe(200);
  done();
});

it('should return a 200 given an empty array', async done => {
  const expected = [];
  todoService.list.mockImplementation(() => Promise.resolve(expected));
  const result = await getTodos();
  expect(result.body).toStrictEqual(expected);
  expect(result.status).toBe(200);
  done();
});