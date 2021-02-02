const supertest = require('supertest');
const getTestUser = require('../../user.fixture');
const mongoFixture = require('../../mongo.fixture');
const uuid = require('../../../src/utilities/generate-uuid');
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

async function createTodo(data) {
  const response = await request
    .post(endpoint)
    .set('auth', `Bearer ${testUser.token}`)
    .send(data);
  return response.body;
}

it('should return todo successfully', async done => {
  const data = {
    title: 'Take the garbage out',
    completed: true
  };
  const todo = await createTodo(data);
  request
    .get(`${endpoint}/${todo.id}`)
    .set('auth', `Bearer ${testUser.token}`)
    .send(data)
    .expect(res => {
      const { title, completed } = res.body;
      expect(title).toBe(data.title);
      expect(completed).toBe(data.completed);
    })
    .expect(200, done);
});

it('should return Not Found for non-existent todo', async done => {
  request
    .get(`${endpoint}/${uuid()}`)
    .expect(404, done);
});
