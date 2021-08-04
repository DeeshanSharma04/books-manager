require('dotenv').config();
const jwt = require('jsonwebtoken');
const BOOKS = require('../models/books');
const USER = require('../models/user');
const { SuccessHandler, ErrorHandler } = require('../utils/globalHandler');

const getAll = async (req, res) => {
  try {
    const books = await BOOKS.find({ isDeleted: 'false' });
    return new SuccessHandler(res, 'All Books', books);
  } catch (err) {
    throw new ErrorHandler(400, 'Something went wrong. Please try again.');
  }
};

const getOne = async (req, res) => {
  try {
    const book = await BOOKS.findById(req.params.id);
    if (!book.isDeleted) {
      new SuccessHandler(res, 'Here is your book', book);
    } else throw new ErrorHandler(404, 'Book not found');
  } catch (err) {
    throw new ErrorHandler(400, 'Something went wrong. Please try again.');
  }
};

const newBook = async (req, res) => {
  try {
    const book = await BOOKS.create(req.body);
    book.token = jwt.sign({ bookID: book._id }, process.env.SECRET_BOOK_TOKEN);
    new SuccessHandler(res, 'Book created successfully.', book);
  } catch (err) {
    throw new ErrorHandler(400, 'Something went wrong. Please try again.');
  }
};

const update = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {
      await BOOKS.findByIdAndUpdate(req.params.id, req.body);
      new SuccessHandler(res, 'Book updated successfully');
    }
  } catch (err) {
    throw new ErrorHandler(400, 'Something went wrong. Please try again.');
  }
};

const deleteBook = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {
      await BOOKS.findByIdAndRemove(req.params.id);
      new SuccessHandler(res, 'Book deleted successfully');
    }
  } catch (err) {
    throw new ErrorHandler(400, 'Something went wrong. Please try again.');
  }
};

const deleteAll = async (req, res) => {
  try {
    await jwt.verify(
      req.headers.usertoken,
      process.env.SECRET_ACCESS_TOKEN,
      async (err, { userID }) => {
        if (err) {
          throw new ErrorHandler(
            401,
            'Authorization error. Session expired please login again.'
          );
        }
        try {
          const user = await USER.findById(userID);
          if (user.role === 'admin') res.locals.isAdmin = true;
          else res.locals.isAdmin = false;
        } catch (err) {
          throw new ErrorHandler(
            404,
            'You are not registered. Please register here: http://localhost:5000/user/signup'
          );
        }
      }
    );
    if (res.locals.isAdmin) {
      await BOOKS.deleteMany();
      new SuccessHandler(res, 'All records have been deleted successfully.');
    } else {
      throw new ErrorHandler(
        401,
        'Authorization error. You are not authorized to perform this action.'
      );
    }
  } catch (err) {
    throw new ErrorHandler(400, 'Something went wrong. Please try again.');
  }
};

module.exports = { getAll, getOne, newBook, update, deleteBook, deleteAll };
