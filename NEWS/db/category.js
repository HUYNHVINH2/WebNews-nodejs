const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name        :   String,  
    position    :   String,
    category_id :   String,
    user_id     :   String,
});

const categoryModel = mongoose.model('category', categorySchema );
module.exports = categoryModel;
