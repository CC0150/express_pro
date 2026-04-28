const mongoose = require('mongoose');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const APIFeatures = require('../utils/apiFeatures');

// 获取用户列表
exports.getUserList = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(User.find(), req.query);
  const query = apiFeatures.filter().sort().select().pagination();

  const users = await query.query;

  return res.status(200).json({
    status: 'success',
    message: '获取用户列表成功',
    length: users.length,
    data: {
      users
    }
  });
});

// 获取用户详情
exports.getUserById = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('无效的用户ID', 400));
  }
  const user = await User.findById(req.params.id);
  console.log(user);
  if (!user) {
    return next(new AppError('用户不存在', 404));
  }
  return res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// 更新用户信息
exports.updateUserById = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('无效的用户ID', 400));
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return next(new AppError('用户不存在', 404));
  }
  return res.status(200).json({
    status: 'success',
    message: '更新用户成功',
    data: {
      user
    }
  });
});

// 创建用户
exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    message: '创建用户成功',
    data: {
      newUser
    }
  });
});

// 删除用户
exports.deleteUser = catchAsync(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new AppError('无效的用户ID', 400));
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('用户不存在', 404));
  }
  res.status(204).json({
    status: 'success',
    message: '删除用户成功'
  });
});
