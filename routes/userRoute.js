const express = require('express');
const {
  getUserList,
  getUserById,
  updateUserById,
  createUser,
  deleteUser,
  checkedIdMiddleware,
  checkedCreateUserMiddleware
} = require('../controllers/userController');

const router = express.Router();

// 通过中间件统一检查用户ID是否存在
router.param('id', checkedIdMiddleware);

router.route('/').get(getUserList).post(checkedCreateUserMiddleware, createUser);

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser);

module.exports = router;
