const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const blackListTokenModel = require("../models/blackListToken.model");
dotenv.config();
captainModel = require("../models/captain.model");


module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        console.log(token);
        const isBlackListed= await blackListTokenModel.findOne({ token: token });
        console.log("tell: ", isBlackListed);
        if(isBlackListed) {
            return res.status(401).json({ msg: "Token is blacklisted" });
        }

        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await userModel.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ msg: "User not found." });
        }

        req.user = user;

        return next();
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


module.exports.authCaptain = async (req, res, next) => {
    const token= req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const isBlackListed= await blackListTokenModel.findOne({ token: token });

    if(isBlackListed) {
        return res.status(401).json({ msg: 'Token is blacklisted' });
    }

    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);
        const captain= await captainModel.findById(decoded.id);
        req.captain= captain;
        return next();
    }
    catch(err) {
        return res.status(500).json({ msg: 'Unauthorized' });
    }
};


