const mongoose= require('mongoose');
const jwt= require('jsonwebtoken');
const bcrypt= require('bcrypt');


const captainSchema= new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minLength: [ 3, 'First name must be at least 3 characters long' ]
        },
        lastName: {
            type: String,
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email address' ]
    },
    password: {
        type: String,
        required: true,
        select: false,
        minLength: [ 3, 'Password must be at least 3 characters long' ]
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive'
    },
    vehicle:{
        color:{
            type: String,
            required: true,
            minLength: [ 3, 'Color must be at least 3 characters long' ]
        },
        plate: {
            type: String,
            required: true,
            minLength: [ 3, 'Plate must be at least 3 characters long' ]
        },
        capacity: {
            type: Number,
            required: true,
            min: [ 1, 'Capacity must be at least 1' ]
        },
        vehicleType: {
            type: String,
            enum: [ 'car', 'motorcycle', 'auto' ],
            required: true
        },
        location: {
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number,
            }
        }
    }
})

captainSchema.methods.generateAuthToken= function() {
    const token= jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    return token;
}

captainSchema.methods.comparePassword= async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

captainSchema.statics.hashPassword= async function(password) {
    return await bcrypt.hash(password, 10);
}

const captainModel= mongoose.model('captain', captainSchema);
module.exports= captainModel;