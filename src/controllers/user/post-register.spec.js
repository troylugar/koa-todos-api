const ValidationError = require('../../errors/validation.error');
const postRegisterWrapper = require('./post-register');

it('should return 201 when successfully registered', async done => {
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  const userService = {
    register: jest.fn()
  };
  const postRegister = postRegisterWrapper({ userService });
  const result = await postRegister(context);
  expect(result.status).toBe(201);
  done();
});

it('should return 400 when ValidationError thrown', async done => {
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  const errorMessage = 'model failed validation';
  const userService = {
    register: jest.fn(() => { throw new ValidationError(errorMessage); })
  };
  const postRegister = postRegisterWrapper({ userService });
  const result = await postRegister(context);
  expect(result.status).toBe(400);
  expect(result.body).toBe(errorMessage);
  done();
});

it('should throw unhandled errors', async done => {
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
  const userService = {
    register: jest.fn(() => { throw new Error(); })
  };
  const postRegister = postRegisterWrapper({ userService });
  await expect(postRegister(context)).rejects.toThrow(Error);
  done();
});
