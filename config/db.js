const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose.connect(
    'mongodb://localhost:27017/books-manager',
    {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (!err) {
        return console.log('Database connected');
      }
      return console.log('Database connection problem');
    }
  );
};

module.exports = connectDB;
