const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


const path = require('path');
const { StringDecoder } = require('string_decoder');
app.use(express.json());

const blacklistSchema = new mongoose.Schema({
    name:String,
    gender: String,
    hairColor: String,
    eyeColor: String,
    skinColor: String,
    height: String,
    weight: String,
    IDType: String,
    ID: String,
    reason: { type: String, required: true },
    // picture: String,
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);

class BlacklistAccount {
    static async addEntry(data) {
        const entry = new Blacklist(data);
        await entry.save();
        return entry;
    }

    static async queryEntries() {
        return await Blacklist.find();
    }

    // // 删除黑名单条目
    // static async deleteEntry(entryId) {
    //     await Blacklist.findByIdAndDelete(entryId);
    // }
}

module.exports = {
    Blacklist,
    BlacklistAccount
};