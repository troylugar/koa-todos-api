const fs = require('fs');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// mapping the environment helps to decouple
// the code from specific environment vars
module.exports = {
  port: +process.env.PORT || 3000,
  mongo_uri: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  auth_public_key: fs.readFileSync('public_key.pem'),
  auth_private_key: fs.readFileSync('private_key.pem'),
  salt_rounds: +process.env.SALT_ROUNDS,
};
