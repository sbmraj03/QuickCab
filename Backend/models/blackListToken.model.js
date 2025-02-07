const mongoose= require('mongoose');

const blackListToken= new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expirex: 86400
    }
});

module.exports= mongoose.model('BlackListToken', blackListToken);