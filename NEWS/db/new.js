const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewSchema = new Schema({
    title     : String,
    image     : String,
    content   : String,
    author    : String,
          
});
const newModel = mongoose.model('new', NewSchema );
module.exports = newModel;


