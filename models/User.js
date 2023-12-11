const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// 定义用户模式
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true,
        unique: true
    }
});

// 在保存用户之前对密码进行加密
userSchema.pre('save', async function (next) {
    // 只在密码被修改时加密
    if (!this.isModified('password')) return next();

    // 生成盐并加密
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 添加一个方法来验证密码
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 导出用户模型
module.exports = mongoose.model('User', userSchema);
