const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer({
  instance: {
    port: 9001 // not on the same port used for local development
  }
});

async function startMongo() {
  await mongod.start();
  return mongod;
}

async function stopMongo() {
  await mongod.stop();
}

async function getUri() {
  const uri = await mongod.getUri();
  return uri;
}

module.exports.start = startMongo;
module.exports.stop = stopMongo;
module.exports.getUri = getUri;