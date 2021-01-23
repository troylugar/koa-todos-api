const getTodosWrapper = require('./get-todos');

it('should return a 200 given an array of objects', async done => {
  const expected = [{ title: 'Fake todo' }];
  const todoServiceFake = {
    list: jest.fn(() => Promise.resolve(expected))
  };
  const getTodos = getTodosWrapper({todoService: todoServiceFake });
  const result = await getTodos();
  expect(result.body).toStrictEqual(expected);
  expect(result.status).toBe(200);
  done();
});

it('should return a 200 given an empty array', async done => {
  const expected = [];
  const todoServiceFake = {
    list: jest.fn(() => Promise.resolve(expected))
  };
  const getTodos = getTodosWrapper({todoService: todoServiceFake });
  const result = await getTodos();
  expect(result.body).toStrictEqual(expected);
  expect(result.status).toBe(200);
  done();
});