const supertest = require('supertest');
const mongoFixture = require('../../mongo.fixture');
const getTestUser = require('../../user.fixture');
const config = require('../../../src/utilities/config');

const endpoint = '/api/todos';

let server, request, testUser, testTodo;
beforeAll(async () => {
  await mongoFixture.start();
  config.mongoUri = await mongoFixture.getUri();
  config.node_env = 'production';
  const app = require('../../../src/app');
  server = app.listen();
  request = supertest(server);
  testUser = await getTestUser(request);
  testTodo = await createTodo({
    title: 'Take the trash out',
    completed: false
  });
});

afterAll(async () => {
  await mongoFixture.stop();
  server.close();
});

async function createTodo(data) {
  const response = await request
    .post(endpoint)
    .set('auth', `Bearer ${testUser.token}`)
    .send(data);
  return response.body;
}

it('should update todo successfully', async done => {
  const data = {
    title: 'Take the garbage out',
    completed: true
  };

  request
    .patch(`${endpoint}/${testTodo.id}`)
    .set('auth', `Bearer ${testUser.token}`)
    .send(data)
    .expect(res => {
      expect(res.body.id).toBe(testTodo.id);
      expect(res.body.createdAt).toBe(testTodo.createdAt);
      expect(res.body.completed).toBe(data.completed);
      expect(res.body.title).toBe(data.title);
    })
    .expect(200, done);
});

it('should return Unauthorized when token is invalid', async done => {
  request
    .patch(`${endpoint}/${testTodo.id}`)
    .set('auth', 'Bearer not a token')
    .send({})
    .expect({
      name: 'AuthenticationError',
      message: 'jwt malformed'
    })
    .expect(401, done);
});

it('should return Unauthorized when token is missing', async done => {
  request
    .patch(`${endpoint}/${testTodo.id}`)
    .send({})
    .expect({
      name: 'AuthenticationError',
      message: 'No token provided'
    })
    .expect(401, done);
});
