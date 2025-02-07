const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastName: {
            type: String,
        }
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    socketId: {
        type: String,
    }
});

userSchema.methods.generateAuthToken = function() { 
    const token= jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    return token;
}

userSchema.methods.comparePassword = async function(password) {   
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword= async function(password) {
    return await bcrypt.hash(password, 10);
}

const User= mongoose.model('User', userSchema);
module.exports= User;