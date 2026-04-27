const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '名字不能为空'],
      minlength: [3, '名字不能少于3个字符'],
      maxlength: [20, '名字不能多于20个字符'],
      trim: true,
      unique: true
    },
    age: {
      type: Number,
      required: [true, '年龄不能为空'],
      min: [0, '年龄不能小于0岁'],
      max: [80, '年龄不能大于80岁']
    },
    sex: {
      type: String,
      required: [true, '性别不能为空'],
      enum: {
        values: ['男', '女'],
        message: '{VALUE} 不是一个有效的性别'
      }
    },
    phone: {
      type: String,
      validate: {
        validator: (val) => {
          const phoneRegex = /^1[3456789]\d{9}$/;
          return phoneRegex.test(val);
        },
        message: '{VALUE}->手机号格式错误'
      },
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false // 不返回 createdAt 字段
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
  return `${this.name}-${this.sex}`;
});

userSchema.pre('save', function () {
  console.log('pre save');
});

userSchema.pre('find', function () {
  this.find({ age: { $gt: 8 } });
});

const User = mongoose.model('User', userSchema);

module.exports = User;
