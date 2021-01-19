jest.mock('mongoose', () => ({
  connection: { readyState: 1 }
}));
const mongoose = require('mongoose');
const healthcheck = require('../../src/middleware/health-check');
const Koa = require('koa');
const supertest = require('supertest');
const mockdate = require('mockdate');

const app = new Koa();
app.use(healthcheck());

let server, request;
describe('health-check', () => {
  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  afterAll(() => {
    server.close();
  });

  it('should return 200', (done) => {
    request.get('/health-check').expect(200, done);
  });

  it('should return current timestamp', (done) => {
    const date = new Date();
    mockdate.set(date);
    request.get('/health-check').then(res => {
      expect(res.body.timestamp).toBe(date.toISOString());
      done();
    }).catch(done);
  });

  it('should show mongo status as "up" when mongo is up', (done) => {
    mongoose.connection.readyState = 1;
    request.get('/health-check').then(res => {
      expect(res.body.mongo.status).toBe('up');
      done();
    }).catch(done);
  });

  it('should show mongo status as "down" when mongo is down', (done) => {
    mongoose.connection.readyState = 0;
    request.get('/health-check').then(res => {
      expect(res.body.mongo.status).toBe('down');
      done();
    }).catch(done);
  });
});
