const express = require('express');
const {
  getUserList,
  getUserById,
  updateUserById,
  createUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getUserList).post(createUser);

router.route('/:id').get(getUserById).patch(updateUserById).delete(deleteUser);

module.exports = router;
