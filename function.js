const multer = require('multer');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

// 设置 Multer 存储配置
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage })


// 连接 MongoDB
mongoose.connect('mongodb://mongodb:27017/yourDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connect error: '));
db.once('open', function() {
    console.log("MongoDB successfully connected!");
});

// 定义一个模型来存储图片和文字
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  animal:{ type: String, required: true },
  size: String,
  color: String,
  city: { type: String, required: true },
  detail: { type: String, required: true },
  zipcode: { type: String, required: true },
  picture: String,
});

const Item = mongoose.model('Item', ItemSchema);

function uploadToMongoDB(req, res, next) {
  const newItem = new Item({
    picture: '/upload/' + req.file.filename,
    animal: req.body.animal,
    size: req.body.size,
    color: req.body.color,
    city: req.body.city,
    detail: req.body.detail,
    zipcode: req.body.zipcode,
  });

  newItem.save()
    .then(() => {
      res.send(`
      <link rel="stylesheet" href="/static/css/home.css">
      <p>upload success</p>
      <button onclick="location.href='/'">home page</button>
    `);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
}


function getLatestUpload(req, res, next) {
  Item.find().sort({ _id: -1 }).limit(5)
    .then(items => {
      if (!items) {
        return res.status(404).send({ message: "没有找到上传的文件。" });
      }
      res.json(items);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
}



module.exports = {
  upload,
  uploadToMongoDB,
  getLatestUpload,
};