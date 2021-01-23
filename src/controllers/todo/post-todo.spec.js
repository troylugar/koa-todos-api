afterEach(() => {
  jest.resetModules();
});

it('should return a 201 when todo created', async done => {
  const body = { title: 'post test' };
  jest.mock('../../models/todo', () => jest.fn(() => body));
  const postTodoWrapper = require('./post-todo');
  const todoServiceFake = {
    create: jest.fn(() => body)
  };
  const postTodo = postTodoWrapper({todoService: todoServiceFake});
  const result = await postTodo({ body });
  expect(todoServiceFake.create).toHaveBeenCalledWith(body);
  expect(result.status).toBe(201);
  expect(result.body).toBe(body);
  done();
});
