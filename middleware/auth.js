require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const USER = require('../models/user');
const BOOK = require('../models/books');
const { ErrorHandler } = require('../utils/globalHandler');

const userAuth = async (req, res, next) => {
  try {
    const User = await USER.findOne({ email: req.body.email });
    if (
      req.params.id.toString() === User._id.toString() &&
      bcrypt.compareSync(req.body.password, User.password)
    ) {
      const tokenLength = User.token.length;
      jwt.verify(
        User.token[tokenLength - 1],
        process.env.SECRET_ACCESS_TOKEN,
        (err) => {
          if (err) {
            res.locals.isAuthenticated = false;
            throw new ErrorHandler(
              401,
              'Authorization error. Session expired please login again.'
            );
          }
          res.locals.isAuthenticated = true;
          res.locals.user = User;
        }
      );
      return next();
    }
    res.locals.isAuthenticated = false;
    throw new ErrorHandler(401, 'Authorization error.');
  } catch (err) {
    throw new ErrorHandler(
      404,
      'You are not registered. Please sign up here: http://localhost:5000/user/signup'
    );
  }
};

const bookAuth = async (req, res, next) => {
  try {
    const Book = await BOOK.findById(req.params.id);
    jwt.verify(
      req.headers.usertoken,
      process.env.SECRET_ACCESS_TOKEN,
      (err, { userID }) => {
        if (err) {
          res.locals.isAuthenticated = false;
          throw new ErrorHandler(
            401,
            'Authorization error. Session expired please login again.'
          );
        }
        if (Book.authorID.toString() === userID.toString()) {
          res.locals.isAuthenticated = true;
          res.locals.book = Book;
          return next();
        } else {
          res.locals.isAuthenticated = false;
          throw new ErrorHandler(
            401,
            'Authentication error. Operation not allowed.'
          );
        }
      }
    );
  } catch (err) {
    throw new ErrorHandler(404, 'Book not found in the database.');
  }
};

module.exports = { userAuth, bookAuth };
