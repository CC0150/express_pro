const express = require('express');
const morgan = require('morgan');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

const userRoutes = require('./routes/userRoute');
app.use('/users', userRoutes);

// 处理请求未匹配路由的情况
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Not Found ${req.originalUrl}`
  });
});

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

module.exports = app;
