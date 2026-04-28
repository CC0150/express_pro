const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

// 生成 JWT 令牌
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // 令牌过期时间(90天)
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 注册用户
exports.signup = catchAsync(async (req, res, next) => {
  // 验证用户输入
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) {
    return next(new AppError('请填写完整的用户信息', 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError('两次输入的密码不一致', 400));
  }
  // 使用模型方法创建用户，避免直接使用 req.body，防止用户传递额外字段
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    passwordChangedAt: Date.now(),
    role: req.body.role
  });

  // 生成 JWT 令牌
  const token = signToken(newUser.id);

  res.status(201).json({
    status: 'success',
    message: '创建用户成功',
    token,
    data: {
      newUser
    }
  });
});

// 登录用户
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 验证用户输入
  if (!email || !password) {
    return next(new AppError('请填写邮箱和密码', 400));
  }
  // 检查用户是否存在
  const user = await User.findOne({ email }).select('+password');
  // 检查密码是否正确
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('邮箱或密码错误', 401));
  }

  // 生成 JWT 令牌
  const token = signToken(user.id);
  // 登录成功
  res.status(200).json({
    status: 'success',
    message: '登录成功',
    token
  });
});

// 中间件：保护 JWT 路由，检查用户是否已登录
exports.protect = catchAsync(async (req, res, next) => {
  // 1) 从请求头中获取 token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('请先登录', 401));
  }

  // 2) 验证 token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) 检查用户是否存在
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('用户不存在', 401));
  }

  // 4) 检查用户是否在登录后修改了密码
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('密码已被修改，请重新登录', 401));
  }

  // 5) 令牌验证通过，将用户信息添加到请求对象中
  req.user = user;

  next();
});

// 中间件：保护 JWT 路由，根据用户角色限制访问
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`您没有权限访问该资源`, 403));
    }
    next();
  };
};
