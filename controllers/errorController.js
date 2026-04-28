const AppError = require('../utils/appError');

// 处理数据库字段错误
const handleCastErrorDB = (err) => {
  const message = `无效的 ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// 处理重复键错误
const handleDuplicateErrorDB = (err) => {
  // 从错误对象中提取重复值
  const value = Object.keys(err.keyValue).join(',');
  const message = `重复的字段 ${value}`;
  return new AppError(message, 400);
};

// 处理验证错误
const handleValidationErrorDB = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join(', ');
  return new AppError(message, 400);
};

// 处理 JWT 错误
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

// 处理 JWT 过期错误
const handleJWTExpiredError = () => {
  return new AppError('Token expired. Please log in again.', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: '服务器内部错误'
    });
  }
};

module.exports = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    if (err.name === 'CastError') {
      error = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      error = handleDuplicateErrorDB(err);
    } else if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(err);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};
