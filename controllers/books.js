require('dotenv').config();
const jwt = require('jsonwebtoken');
const BOOKS = require('../models/books');
const USER = require('../models/user');

const getAll = async (req, res) => {
  try {
    const books = await BOOKS.find({ isDeleted: 'false' });
    return res.json({ success: true, books });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

const getOne = async (req, res) => {
  try {
    const book = await BOOKS.findById(req.params.id);
    if (!book.isDeleted) {
      return res.json(book);
    } else throw new Error('Book not found');
  } catch (err) {
    return res.status(404).json({ success: false, error: 'Book not found' });
  }
};

const newBook = async (req, res) => {
  try {
    const book = await BOOKS.create(req.body);
    book.token = jwt.sign({ bookID: book._id }, process.env.SECRET_BOOK_TOKEN);
    return res.json({
      success: true,
      message: 'Book created successfully',
      book,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

const update = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {
      await BOOKS.findByIdAndUpdate(req.params.id, req.body);
      return res.json({ success: true, message: 'Book updated successfully' });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {
      await BOOKS.findByIdAndRemove(req.params.id);
      return res.json({ success: true, message: 'Book deleted successfully' });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    await jwt.verify(
      req.headers.usertoken,
      process.env.SECRET_ACCESS_TOKEN,
      async (err, { userID }) => {
        if (err) {
          return res.status(401).json({
            success: false,
            error: 'Authentication error. Session expired login again',
          });
        }
        try {
          const user = await USER.findById(userID);
          if (user.role === 'admin') res.locals.isAdmin = true;
          else res.locals.isAdmin = false;
        } catch (err) {
          return res.status(404).json({
            success: false,
            error:
              'You are not registered. Please register here: http://localhost:5000/user/signup',
          });
        }
      }
    );
    if (res.locals.isAdmin) {
      await BOOKS.deleteMany();
      return res.json({
        success: true,
        message: 'All the records have been deleted successfully.',
      });
    } else {
      return res.status(401).json({
        success: false,
        error:
          'Authorization error. You are not authorized to perform this action,',
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

module.exports = { getAll, getOne, newBook, update, deleteBook, deleteAll };
