const { userService } = require('../../services');
const ValidationError = require('../../errors/validation.error');
const postRegister = require('./post-register');

jest.mock('../../services');

it('should return 201 when successfully registered', async done => {
  const context = {
    request: {
      body: { username: 'troy', password: 'password' }
    }
  };
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
  userService.register.mockImplementation(() => { throw new ValidationError(errorMessage); });
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
  userService.register.mockImplementation(() => { throw new Error(); });
  await expect(postRegister(context)).rejects.toThrow(Error);
  done();
});
