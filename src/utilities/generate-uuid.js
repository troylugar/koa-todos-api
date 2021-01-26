const mongoose = require('mongoose');

function generateUUID() {
  return mongoose.Types.ObjectId();
}

module.exports = generateUUID;
