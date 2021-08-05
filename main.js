const express = require('express');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');
const connectDB = require('./config/db');
const { handleError } = require('./utils/globalHandler');

connectDB();

const app = express();

app.use(express.json());
app.use('/user', userRoutes);
app.use('/book', bookRoutes);

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.use(handleError);

app.listen(5000, () => {
  console.log('Server is running at port 5000');
});
