const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String,
  roles: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', schema);
