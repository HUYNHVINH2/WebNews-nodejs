const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username         : String,
    password         : String,
    role             : String,

});
const userModel = mongoose.model('user', UserSchema );
module.exports = userModel;


