const getTodoWrapper = require('./get-todo');

it('should return a 404 when todo not found', async done => {
  const id = 'abcd';
  const todoServiceFake = {
    findById: jest.fn(() => undefined)
  };
  const getTodo = getTodoWrapper({todoService: todoServiceFake});
  const result = await getTodo({ params: { id } });
  expect(todoServiceFake.findById).toHaveBeenCalledWith(id);
  expect(result.status).toBe(404);
  done();
});

it('should return a 200 when todo found', async done => {
  const id = 'abcd';
  const expected = { title: 'asdf' };
  const todoServiceFake = {
    findById: jest.fn(() => expected)
  };
  const getTodo = getTodoWrapper({todoService: todoServiceFake});
  const result = await getTodo({ params: { id } });
  expect(todoServiceFake.findById).toHaveBeenCalledWith(id);
  expect(result.body).toBe(expected);
  expect(result.status).toBe(200);
  done();
});