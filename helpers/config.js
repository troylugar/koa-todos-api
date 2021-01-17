if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// mapping the environment helps to decouple
// the code from specific environment vars
module.exports = {
  port: +process.env.PORT || 3000,
  mongo_uri: process.env.MONGO_URI,
  node_env: process.env.node_env
};
