const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const router = express.Router();

app.use(express.json());

const userRoutes = require('./routes/userRoute');
router.use(userRoutes);

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

app.use('/users', router);

module.exports = app;
