const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const userService = require('../services/user.service');
const blackListToken= require('../models/blackListToken.model');


module.exports.registerUser= async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { fullName, email, password } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });   
        if(user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        
        // console.log(req.body)
        // Create new user
        user = await userService.createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password
        })
        // console.log("firstName ")
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();  
        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1d' },
            (err, token) => {
                if(err) throw err;
                res.status(200).json({ token });
            }
        );
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
        }

        // Generate JSON Web Token
        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" },
            (err, token) => {
                if (err) throw err;

                // Set the cookie before sending the response
                res.cookie("token", token);

                res.status(200).json({ token, user });
            }
        );
    } catch (err) {
        res.status(500).send("Server error");
    }
};



module.exports.getUserProfile= async (req,res,next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser= async (req,res,next) => {
    res.clearCookie('token');
    const token= req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListToken.create({ token });

    res.status(200).json({ msg: 'Logged out successfully' });
}