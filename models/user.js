const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: (email) => {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      );
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: [String],
  resetPasswordToken: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('User', userSchema);
