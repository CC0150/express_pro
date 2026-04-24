const fs = require('fs');

const userData = JSON.parse(fs.readFileSync('./data/user.json', 'utf8'));
const users = userData.users;

// 检查用户ID是否存在
exports.checkedIdMiddleware = (req, res, next, _value) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return res.status(400).json({
      status: 'error',
      message: '用户不存在'
    });
  }
  req.userId = userId;
  next();
};

// 检查创建的用户的参数是否完整
exports.checkedCreateUserMiddleware = (req, res, next) => {
  const { name, age } = req.body;
  if (!name || !age) {
    return res.status(400).json({
      status: 'error',
      message: '请提供姓名和年龄'
    });
  }
  next();
};

// 获取用户列表
exports.getUserList = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: '获取用户列表成功',
    data: {
      users
    }
  });
};

// 获取用户详情
exports.getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);
  return res.status(200).json({
    status: 'success',
    message: '获取用户详情成功',
    data: user
  });
};

// 更新用户信息
exports.updateUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((user) => user.id === userId);
  Object.assign(user, req.body);
  fs.writeFileSync('./data/user.json', JSON.stringify({ users }, null, 2));
  return res.status(200).json({
    status: 'success',
    message: '更新用户成功',
    data: user
  });
};

// 创建用户
exports.createUser = (req, res) => {
  const userData = req.body;
  let id = users.length + 1;
  const newUser = { id, ...userData };
  users.push(newUser);
  fs.writeFileSync('./data/user.json', JSON.stringify({ users }, null, 2));
  res.status(201).json({
    status: 'success',
    message: '创建用户成功',
    data: newUser
  });
};

// 删除用户
exports.deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const index = users.findIndex((user) => user.id === userId);
  users.splice(index, 1);
  fs.writeFileSync('./data/user.json', JSON.stringify({ users }, null, 2));
  return res.status(204).json({
    status: 'success',
    message: '删除用户成功'
  });
};
