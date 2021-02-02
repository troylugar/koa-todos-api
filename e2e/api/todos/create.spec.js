const supertest = require('supertest');
const mongoFixture = require('../../mongo.fixture');
const getTestUser = require('../../user.fixture');
const config = require('../../../src/utilities/config');

const endpoint = '/api/todos';

let server, request, testUser;
beforeAll(async () => {
  await mongoFixture.start();
  config.mongoUri = await mongoFixture.getUri();
  config.node_env = 'production';
  const app = require('../../../src/app');
  server = app.listen();
  request = supertest(server);
  testUser = await getTestUser(request);
});

afterAll(async () => {
  await mongoFixture.stop();
  server.close();
});

it('should create todo successfully', async done => {
  const data = {
    title: 'Take the trash out',
    completed: false
  };
  request
    .post(endpoint)
    .set('auth', `Bearer ${testUser.token}`)
    .send(data)
    .expect(res => {
      const { title, completed } = res.body;
      expect(title).toBe(data.title);
      expect(completed).toBe(data.completed);
    })
    .expect(201, done);
});

it('should return Unauthorized when token is invalid', async done => {
  const data = {
    title: 'Take the trash out',
    completed: false
  };
  request
    .post(endpoint)
    .set('auth', 'Bearer not a token')
    .send(data)
    .expect({
      name: 'AuthenticationError',
      message: 'jwt malformed'
    })
    .expect(401, done);
});

it('should return Unauthorized when token is missing', async done => {
  const data = {
    title: 'Take the trash out',
    completed: false
  };
  request
    .post(endpoint)
    .send(data)
    .expect({
      name: 'AuthenticationError',
      message: 'No token provided'
    })
    .expect(401, done);
});

it('should return Bad Request when schema is invalid', async done => {
  const data = {
    title: '',
    completed: false
  };
  request
    .post(endpoint)
    .set('auth', `Bearer ${testUser.token}`)
    .send(data)
    .expect({
      name: 'ValidationError',
      message: '["title must have a length >= 3"]'
    })
    .expect(400, done);
});
