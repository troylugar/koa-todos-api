const registrationEndpoint = '/api/users/register';
const authenticationEndpoint = '/api/users/auth';
const credentials = {
  username: 'anewuser',
  password: 'VerySecret!!1'
};

async function getTestUser(request) {
  await request
    .post(registrationEndpoint)
    .send(credentials);
  const data = await request
    .post(authenticationEndpoint)
    .send(credentials);
  return {
    ...credentials,
    token: data.body.token
  };
}

module.exports = getTestUser;
