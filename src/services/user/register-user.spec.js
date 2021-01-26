const ValidationError = require('../../errors/validation.error');
const registerUserWrapper = require('./register-user');

it('should hash password before inserting user', async done => {
  const user = {
    username: 'troy',
    password: 'C!e4rtext'
  };
  const hashedPassword = 'sdflkne9cnwefoi';
  const userRepository = {
    findByUsername: jest.fn(),
    insert: jest.fn()
  };
  const hashPassword = jest.fn(() => hashedPassword);
  const registerUser = registerUserWrapper({
    userRepository,
    hashPassword
  });
  await registerUser(user);
  const args = userRepository.insert.mock.calls[0][0];
  expect(hashPassword).toHaveBeenCalledWith(user.password);
  expect(args.password).toBe(hashedPassword);
  done();
});

['2short', 'nonumbers', 'n0specialchars', 1234].forEach(password => {
  it(`should validate password before hashing (${password})`, async done => {
    const user = {
      username: 'troy',
      password
    };
    const userRepository = {
      findByUsername: jest.fn(),
      insert: jest.fn()
    };
    const hashPassword = jest.fn();
    const registerUser = registerUserWrapper({
      userRepository,
      hashPassword
    });
    await expect(registerUser(user)).rejects.toThrow(ValidationError);
    expect(hashPassword).not.toHaveBeenCalled();
    expect(userRepository.insert).not.toHaveBeenCalled();
    done();
  });
});
