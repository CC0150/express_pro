const express = require('express');
const {
  getUserList,
  getUserById,
  updateUserById,
  createUser,
  deleteUser
} = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateUser,
  protect
} = require('../controllers/authController');

const router = express.Router();

// 注册用户
router.post('/signup', signup);

// 登录用户
router.post('/login', login);

// 忘记密码
router.post('/forgotPassword', forgotPassword);

// 重置密码
router.patch('/resetPassword', resetPassword, resetPassword);

// 更新用户信息
router.patch('/updateUser', protect, updateUser);

router.route('/').get(getUserList).post(createUser);

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser);

module.exports = router;
