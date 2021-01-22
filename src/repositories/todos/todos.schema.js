const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
  title: String,
  completed: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true });

module.exports = mongoose.model('Todo', schema);