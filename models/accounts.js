const mongoose = require('mongoose');
const schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

const account = new schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String, 
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String, 
    },
    lastName: {
        type: String,
        default: ''
    },
    firstName: {
        type: String,
        default: ''
    },
    phone: {
        type: Number
    }
})

// account.plugin(passportLocalMongoose);



module.exports = mongoose.model('account', account);