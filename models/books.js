const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  page: {
    type: Number,
    required: true,
    trim: true,
    max: 5000,
  },
  authorID: {
    type: mongoose.Schema.ObjectId,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    max: 9000,
  },
  token: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    enum: [true, false],
    trim: true,
  },
});

module.exports = mongoose.model('Book', bookSchema);
