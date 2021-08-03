const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
  authorID: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    enum: [true, false],
  },
});

module.exports = mongoose.model('Book', bookSchema);
