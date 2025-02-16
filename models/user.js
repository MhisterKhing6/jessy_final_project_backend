const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    verifed: {
        type: Boolean,
        default:false
    }
});

module.exports = mongoose.model('User', UserSchema);