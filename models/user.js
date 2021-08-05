const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  age: {
    type: Number,
    required: true,
    min: 10,
    max: 80,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
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
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'user', 'publisher'],
    trim: true,
  },
});

module.exports = mongoose.model('User', userSchema);
