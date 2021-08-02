require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const USER = require('../models/user');
const BOOK = require('../models/books');

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
            return res.status(401).json({
              success: false,
              error: 'Authentication Error. Session expired login again',
            });
          }
          res.locals.isAuthenticated = true;
          res.locals.user = User;
        }
      );
      return next();
    }
    res.locals.isAuthenticated = false;
    return res
      .status(401)
      .json({ success: false, error: 'Authentication error' });
  } catch (err) {
    return res.status(404).json({
      success: false,
      error:
        'You are not registered. Please sign up here: http://localhost:5000/signup',
    });
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
          return res.status(401).json({
            success: false,
            error: 'Authentication error. Session expired login again',
          });
        }
        if (Book.authorID.toString() === userID.toString()) {
          res.locals.isAuthenticated = true;
          res.locals.book = Book;
          return next();
        } else {
          res.locals.isAuthenticated = false;
          return res.status(401).json({
            success: false,
            error: 'Authentication error. Operation not allowed.',
          });
        }
      }
    );
  } catch (err) {
    return res
      .status(404)
      .json({ success: false, error: 'Book not found in the database' });
  }
};

module.exports = { userAuth, bookAuth };
