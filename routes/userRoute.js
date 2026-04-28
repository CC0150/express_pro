const express = require('express');
const {
  getUserList,
  getUserById,
  updateUserById,
  createUser,
  deleteUser
} = require('../controllers/userController');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// 注册用户
router.post('/signup', signup);

// 登录用户
router.post('/login', login);

router.route('/').get(getUserList).post(createUser);

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser);

module.exports = router;
