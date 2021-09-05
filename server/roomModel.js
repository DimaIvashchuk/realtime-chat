const pkg = require('mongoose');
const { Schema, model } = pkg;

const schema = new Schema({
  title: {
    type: String,
    required: true
  }
})

module.exports = model('Room', schema);