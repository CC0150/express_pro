const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const { protect } = require('./controllers/authController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

const userRoutes = require('./routes/userRoute');
app.use('/users', userRoutes);

app.get('/test', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '测试成功'
  });
});

// 处理请求未匹配路由的情况
app.use((req, res, next) => {
  const err = new AppError(`Not Found ${req.originalUrl}`, 404);
  next(err);
});

app.use(errorController);

module.exports = app;
