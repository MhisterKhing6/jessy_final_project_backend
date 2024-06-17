const mongoose = require('mongoose');

const VerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    verificationCode: {
        type: String,
        required: true,

    }
});

module.exports = mongoose.model('Verification', VerificationSchema);