const fs = require('fs');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// mapping the environment helps to decouple
// the code from specific environment vars

const config = {
  port: +process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  node_env: process.env.NODE_ENV,
  publicKey: process.env.AUTH_PUBLIC_KEY || fs.readFileSync('public_key.pem'),
  privateKey: process.env.AUTH_PRIVATE_KEY || fs.readFileSync('private_key.pem'),
  saltRounds: +process.env.SALT_ROUNDS,
  jwt: {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN
  }
};

module.exports = config;
