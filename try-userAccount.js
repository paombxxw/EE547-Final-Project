const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // 请替换成你的密钥
const app = express();
app.use(bodyParser.json());

const multer = require('multer');

const path = require('path');
app.use(express.json());


// 用户模型
const try_userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  hash: String,
  salt: String
});

// 设置密码
try_userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

// 验证密码
try_userSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
  return this.hash === hash;
};

const try_User = mongoose.model('try_User', try_userSchema);

// 用户账户类
class try_UserAccount {
  // 注册
  static async register(username, password) {
    const user = new try_User({ username });
    user.setPassword(password);
    await user.save();
    return try_UserAccount.generateToken(user);
  }

  // 登录
  static async login(username, password) {
    console.log('Login attempt for username:', username); // 日志用户名

    const user = await try_User.findOne({ username });
    if (!user) {
      console.log('User not found for username:', username); // 如果用户未找到
      throw new Error('Invalid credentials');
    }

    const validPassword = user.validatePassword(password);
    console.log('Password validation result:', validPassword); // 日志密码验证结果

    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = try_UserAccount.generateToken(user);
    console.log('Generated token:', token); // 日志生成的令牌

    return token;
  }
  // 生成令牌
  static generateToken(user) {
    return jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3m' });
  }

  // 更改密码
  static async changePassword(userId, oldPassword, newPassword) {
    const user = await try_User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 验证旧密码
    if (!user.validatePassword(oldPassword)) {
      throw new Error('Invalid old password');
    }

    // 设置新密码
    user.setPassword(newPassword);
    await user.save();
  }

  // 删除账户
  static async deleteAccount(userId) {
    await try_User.findByIdAndDelete(userId);
  }
}


module.exports = {
    try_User,
    try_UserAccount
};