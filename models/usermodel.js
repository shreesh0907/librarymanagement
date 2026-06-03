const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    subscriptionType:{
        type: String,
        required:true
    },
    subscriptionDate:{
        type: String,
        required:true
    },
    issuedDate:{
        type: String,
        required: false
    },
    returnDate:{
        type: String,
        required: false
    },
    issuedBook:{
        type: Schema.Types.ObjectId,
        ref: 'books',
        required: false
    }
})

module.exports = mongoose.model('users', UserSchema);
