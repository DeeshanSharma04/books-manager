require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USER = require('../models/user');
const BOOKS = require('../models/books');
const sendMail = require('../utils/sendMail');

const signUp = async (req, res) => {
  try {
    const isUser = await USER.findOne({ email: req.body.email });

    if (!isUser) {
      const { password } = req.body;
      if (password.length > 8 && password.length < 16) {
        req.body.password = await bcrypt.hash(password, 10);
        const user = await USER.create(req.body);
        user.token = [];
        user.token.push(
          jwt.sign({ userID: user._id }, process.env.SECRET_ACCESS_TOKEN, {
            expiresIn: '20m',
          })
        );
        await user.save();
        return res.json({
          success: true,
          message: 'User created successfully',
          user,
        });
      }
    } else
      return res.status(403).json({
        success: false,
        error:
          'You are already signed up. Please login here: http://localhost:5000/user/login',
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await USER.findOne({ email: email });
    if (bcrypt.compareSync(password, user.password)) {
      const tokenLength = user.token.length;
      jwt.verify(
        user.token[tokenLength - 1],
        process.env.SECRET_ACCESS_TOKEN,
        async (err) => {
          try {
            if (err) {
              user.token.push(
                jwt.sign(
                  { userID: user._id },
                  process.env.SECRET_ACCESS_TOKEN,
                  {
                    expiresIn: '20m',
                  }
                )
              );
              await user.save();
              return res.json({
                success: true,
                message: `Welcome ${user.name}`,
                user,
              });
            }
            return res.json({
              success: true,
              message: `Welcome ${user.name}`,
              user,
            });
          } catch (err) {
            return res.status(400).json({
              success: false,
              error: 'Something went wrong. Please try again.',
            });
          }
        }
      );
    } else {
      return res
        .status(401)
        .json({ success: false, error: 'Incorrect password' });
    }
  } catch (err) {
    return res.status(404).json({
      success: false,
      error:
        'You are not registered. Please sign up here: http://localhost:5000/user/signup',
    });
  }
};

const profile = async (req, res) => {
  try {
    const user = await USER.findById(req.params.id);
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (res.locals.isAuthenticated) {
      const user = res.locals.user;
      const books = await BOOKS.find({ authorID: user._id });
      if (books.length !== 0) {
        books.forEach(async (book) => {
          book.isDeleted = true;
          try {
            await book.save();
          } catch (err) {
            return res.status(401).json({
              success: false,
              error: 'Something went wrong. Please try again.',
            });
          }
        });
      }
      await USER.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'User deleted successfully' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again',
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const user = await USER.findOne({ email: req.body.email });
    const resetPasswordToken = jwt.sign(
      { userID: user._id },
      process.env.PASSWORD_RESET_TOKEN,
      { expiresIn: '10m' }
    );
    await USER.findByIdAndUpdate(user._id, { resetPasswordToken });
    sendMail(user.email, resetPasswordToken, res);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      error: 'Something went wrong. Please try again later.',
    });
  }
};

const resetPassword = (req, res) => {
  jwt.verify(
    req.params.token,
    process.env.PASSWORD_RESET_TOKEN,
    async (err) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Authentication error. Invalid token or token expired',
        });
      }
      try {
        const user = await USER.findOne({
          resetPasswordToken: req.params.token,
        });
        if (user) {
          const { newPassword, confirmNewPassword } = req.body;
          if (newPassword == confirmNewPassword) {
            if (newPassword.length > 8 && newPassword.length < 16) {
              user.password = await bcrypt.hash(newPassword, 10);
              user.resetPasswordToken = '';
              await user.save();
              return res.json({
                success: true,
                message: 'Password reset successful',
              });
            } else {
              return res.status(400).json({
                success: false,
                error: 'Password length must be between 8 to 16',
              });
            }
          } else {
            return res.status(400).json({
              success: false,
              error: 'New password and confirm new password does not match',
            });
          }
        } else {
          return res
            .status(404)
            .json({ success: false, error: 'No user found with this token' });
        }
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: 'Something went wrong. Please try again.',
        });
      }
    }
  );
};

module.exports = {
  signUp,
  login,
  profile,
  deleteUser,
  forgotPassword,
  resetPassword,
};
