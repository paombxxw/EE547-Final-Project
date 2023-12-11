const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const port = 3000;
app.use(express.json());
const { Schema, Document } = mongoose;
const { try_User, try_UserAccount } = require('./try-userAccount');
const { Blacklist, BlacklistAccount } = require('./Blacklist');


const { upload, uploadToMongoDB, getLatestUpload } = require('./function.js');


// 提供静态服务
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));


app.get('/Blacklist', (req, res) => {
    res.sendFile(__dirname + '/views/Blacklist.html');
});

// 添加黑名单条目
app.get('/blacklist/report', async (req, res) => {
    res.sendFile(__dirname + '/views/reportBL.html');
});


app.post('/blacklist/report', upload.single('picture'), async (req, res) => {
    try {
        const entryData = {
            name: req.body.name,
            gender: req.body.gender,
            hairColor: req.body.haircolor,
            eyeColor: req.body.eyecolor,
            skinColor: req.body.skincolor,
            height: req.body.height,
            weight: req.body.weight,
            IDType: req.body.IDType,
            ID: req.body.ID,
            reason: req.body.reason,
            // picture: req.file ? req.file.path : ''  // 处理picture
        };

        // 调用 addEntry 方法保存数据
        const entry = await BlacklistAccount.addEntry(entryData);
        res.status(201).send(entry);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


//根据输入检索BL
app.get('/blacklist/search', async (req, res) => {
    res.sendFile(__dirname + '/views/searchBL.html');
});
app.get('/blacklist/search-results', async (req, res) => {
    try {
        let query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.gender) {
            query.gender = { $regex: req.query.gender, $options: 'i' };
        }
        if (req.query.hairColor) {
            query.hairColor = { $regex: req.query.hairColor, $options: 'i' };
        }
        if (req.query.eyeColor) {
            query.eyeColor = { $regex: req.query.eyeColor, $options: 'i' };
        }
        if (req.query.skinColor) {
            query.skinColor = { $regex: req.query.skinColor, $options: 'i' };
        }
        if (req.query.height) {
            query.height = { $regex: req.query.height, $options: 'i' };
        }
        if (req.query.weight) {
            query.weight = { $regex: req.query.weight, $options: 'i' };
        }
        if (req.query.IDType) {
            query.IDType = { $regex: req.query.IDType, $options: 'i' };
        }
        if (req.query.ID) {
            query.ID = { $regex: req.query.ID, $options: 'i' };
        }

        const results = await Blacklist.find(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});



// // 删除黑名单条目
// app.delete('/api/blacklist/:id', async (req, res) => {
//     try {
//         await BlacklistAccount.deleteEntry(req.params.id);
//         res.status(200).send({ message: 'Entry deleted successfully' });
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// });

const try_userAccount = new try_UserAccount();

// account register
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/try-register.html');
});
app.post('/try-register', async (req, res) => {
    try {
      const token = await try_UserAccount.register(req.body.username, req.body.password);
      res.status(200).send({ token });
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
});
  

// account log in
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/try-login.html');
});
app.post('/try-login', async (req, res) => {
    try {
        const token = await try_UserAccount.login(req.body.username, req.body.password);
        res.status(200).send({ token: token, message: 'Login successful' });
    } catch (e) {
        if (e.message === 'Invalid credentials') {
            res.status(401).send({ message: 'Invalid credentials' });
        } else {
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
});



// account change password
app.get('/update-password', (req, res) => {
    res.sendFile(__dirname + '/views/try-change-password.html');
});

// app.post('/try-change-password', async (req, res) => {
//     try {
//         // 获取请求头中的令牌
//         const token = req.headers.authorization?.split(' ')[1];
//         if (!token) {
//             return res.status(401).send({ message: 'No token provided' });
//         }

//         // 解码令牌获取用户ID
//         const decoded = jwt.verify(token, SECRET_KEY);
//         const userId = decoded.userId;

//         const { oldPassword, newPassword } = req.body;
//         await try_UserAccount.changePassword(userId, oldPassword, newPassword);
//         res.status(200).send({ success: true, message: 'Password changed successfully' });
//     } catch (e) {
//         res.status(400).send({ success: false, message: e.message });
//     }
// });
app.post('/try-change-password', async (req, res) => {
    try {
        const userId = '已知的用户ID'; // 用一个已知的用户ID替换
        const { oldPassword, newPassword } = req.body;

        const user = await try_User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        if (!user.validatePassword(oldPassword)) {
            return res.status(400).send({ message: 'Invalid old password' });
        }

        user.setPassword(newPassword);
        await user.save();

        return res.status(200).send({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Change Password Error:', error); // 详细打印错误信息
        return res.status(500).send({ success: false, message: error.message });
    }
});



// 删除账户路由
app.post('/try-delete-account', async (req, res) => {
    try {
      await try_UserAccount.deleteAccount(req.body.userId);
      res.status(200).send('Account deleted successfully');
    } catch (e) {
      res.status(400).send(e.message);
    }
});

app.get('/try-account', (req, res) => {
    res.sendFile(__dirname + '/views/try-account.html');
});

// 设置路由来处理文件上传
app.post('/Found_Strays', upload.single('picture'), uploadToMongoDB);


app.get('/api/latest-upload', getLatestUpload);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});


app.get('/Animal_Adoption', (req, res) => {
    res.sendFile(__dirname + '/views/Animal_Adoption.html');
});

app.get('/Found_Strays', (req, res) => {
    res.sendFile(__dirname + '/views/Found_Strays.html');
});

app.get('/Report_Blacklist', (req, res) => {
    res.sendFile(__dirname + '/views/Report_Blacklist.html');
});

app.get('/Help_Strays', (req, res) => {
    res.sendFile(__dirname + '/views/Help_Strays.html');
});

app.get('/Map', (req, res) => {
    res.sendFile(__dirname + '/views/Map.html');
});

app.get('/searchBL', (req, res) => {
    res.sendFile(__dirname + '/views/searchBL.html');
});

app.get('/reportBL', (req, res) => {
    res.sendFile(__dirname + '/views/reportBL.html');
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});