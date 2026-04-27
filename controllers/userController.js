const User = require('../models/userModel');

const APIFeatures = require('../utils/apiFeatures');

// 获取用户列表
exports.getUserList = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: '获取用户列表失败',
      error: err.message
    });
  }
};

// 获取用户详情
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch {
    res.status(400).json({
      status: 'error',
      message: '获取用户详情失败'
    });
  }
};

// 更新用户信息
exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    return res.status(200).json({
      status: 'success',
      message: '更新用户成功',
      data: {
        user
      }
    });
  } catch {
    res.status(400).json({
      status: 'error',
      message: '更新用户失败'
    });
  }
};

// 创建用户
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      message: '创建用户成功',
      data: {
        newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: `创建用户失败, 请检查输入数据`,
      error: err.message
    });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: 'success',
      message: '删除用户成功'
    });
  } catch {
    res.status(400).json({
      status: 'error',
      message: '删除用户失败'
    });
  }
};
