const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    author:{
        type: String,
        required:true
    },
    genre:{
        type: String,
        required:true
    },
    year:{
        type: Number,
        required:true
    },
    issued:{
        type: Boolean,
        required:true
    },
    issuedto:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false
    }
})

module.exports = mongoose.model('books', BookSchema);
