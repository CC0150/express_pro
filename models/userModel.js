const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '名字不能为空'],
      trim: true
    },
    email: {
      type: String,
      required: [true, '邮箱不能为空'],
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: (val) => validator.isEmail(val),
        message: '{VALUE} 不是一个有效的邮箱'
      }
    },
    password: {
      type: String,
      required: [true, '密码不能为空'],
      trim: true,
      select: false, // 不返回密码 字段
      minlength: [6, '密码长度不能小于6个字符'],
      maxlength: [32, '密码长度不能大于32个字符']
    },
    confirmPassword: {
      type: String,
      required: [true, '确认密码不能为空'],
      trim: true,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: '两次输入的密码不一致'
      }
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // 不返回 createdAt 字段
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    }
  }
);

// 虚拟字段(不存储在数据库中，仅用于返回)
userSchema.virtual('fullName').get(function () {
  return `${this.name}-${this.email}`;
});

// 加密密码
userSchema.pre('save', async function () {
  // 只有当密码被修改时才加密密码
  if (!this.isModified('password')) {
    return;
  }
  // 加密密码
  this.password = await bcrypt.hash(this.password, 12);
  // 清除确认密码字段，避免存储在数据库中
  this.confirmPassword = undefined;
});

// 检查密码是否正确
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// 检查用户是否在登录后修改了密码
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  // 转换为秒级时间戳
  const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  return this.passwordChangedAt && JWTTimeStamp < changedTimestamp;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
