const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/User');
const path = require('path');
const port = 3000;
app.use(express.json());

class UserAccount {
    constructor(file) {}

    async getAccount(user_email, username, password) {
        if (!username || !password || !user_email) {
            throw new Error('Need username, password, and email');
        }

        const existingUser = await User.findOne({ user_email });
        if (!existingUser) {
            throw new Error('Email not registered');
        }


        return { message: 'Account get successfully' }; 
    }

    async registerAccount(user_email, username, password) {
        let errors = [];
        if (!username) errors.push("Username is required.");
        if (!password) errors.push("Password is required.");
        if (!user_email) errors.push("Email is required.");
    
        const existingUser = await User.findOne({ user_email });
        if (existingUser) {
            throw new Error('Email has already been registered');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        if (errors.length > 0) {
            throw new Error(errors.join(" "));
        }

        const newUser = new User({ username, password: hashedPassword, user_email });
        await newUser.save();

        return { message: 'Account create successfully' }; 
    }

    async loginAccount(user_email, password) {
        if (!user_email || !password) {
            return { success: false, message: 'Need email and password' };
        }
    
        const user = await User.findOne({ user_email });
    
        if (!user) {
            return { success: false, message: 'Email not registered' };
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: 'Incorrect password' };
        }
        return { success: true, message: 'Login successfully', user };
    }
    

    async updatePassword(user_email, oldPassword, newPassword) {
        if (!oldPassword || !newPassword) {
            throw new Error('Both old and new passwords are required');
        }

        const user = await User.findOne({ user_email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Incorrect old password');
        }

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return { message: 'Password updated successfully' };
    }

    async deleteAccount(user_email){
        const result = await User.deleteOne({ user_email });
        if (result.deletedCount === 0) {
            throw new Error('User not found');
        }

        return { message: 'Account deleted successfully' };
    }

}


module.exports = UserAccount;

