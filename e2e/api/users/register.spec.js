const supertest = require('supertest');
const mongoFixture = require('../../mongo.fixture');
const config = require('../../../src/utilities/config');

const endpoint = '/api/users/register';

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

it('should create user if one does not exist', async done => {
  request
    .post(endpoint)
    .send({
      username: 'uniqueuser',
      password: 'VerySecret!!1'
    })
    .expect(201, done);
});

it('should return Bad Request if the username is taken', async done => {
  request
    .post(endpoint)
    .send({
      username: 'duplicateuser',
      password: 'VerySecret!!1'
    })
    .expect(201, () => {
      request
        .post(endpoint)
        .send({
          username: 'duplicateuser',
          password: 'VerySecret!!1'
        })
        .expect(400, done);
    });
});

it('should return Bad Request if the model fails validation', async done => {
  const expectations = [
    'password must be a string',
    'password must have length >= 8',
    'password must contain at least 1 special character',
    'password must contain at least 1 number'
  ];
  request
    .post(endpoint)
    .send({
      username: 'u',
      password: 0
    })
    .expect(400, JSON.stringify(expectations), done);
});
