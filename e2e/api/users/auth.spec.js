const supertest = require('supertest');
const mongoFixture = require('../../mongo.fixture');
const config = require('../../../src/utilities/config');

const registrationEndpoint = '/api/users/register';
const authenticationEndpoint = '/api/users/auth';

let server, request;
beforeAll(async () => {
  await mongoFixture.start();
  config.mongoUri = await mongoFixture.getUri();
  config.node_env = 'production';
  const app = require('../../../src/app');
  server = app.listen();
  request = supertest(server);
});

afterAll(async () => {
  await mongoFixture.stop();
  server.close();
});

it('should return 200 with a token upon successful login', async done => {
  const credentials = {
    username: 'anewuser',
    password: 'VerySecret!!1'
  };
  request
    .post(registrationEndpoint)
    .send(credentials)
    .expect(201, () => {
      request
        .post(authenticationEndpoint)
        .send(credentials)
        .expect(res => {
          expect(res.body.token).toBeDefined();
        })
        .expect(200, done);
    });
});

it('should return 401 upon unsuccessful login', async done => {
  const credentials = {
    username: 'anewuser',
    password: 'VerySecret!!1'
  };
  request
    .post(registrationEndpoint)
    .send(credentials)
    .expect(201, () => {
      request
        .post(authenticationEndpoint)
        .send({
          username: credentials.username,
          password: 'wrong password'
        })
        .expect({
          name: 'AuthenticationError',
          message: 'username/password mismatch'
        })
        .expect(401, done);
    });
});
