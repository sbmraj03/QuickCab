const captainModel = require('../models/captain.model');
captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');


module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, vehicle} = req.body;

    const isCaptainAlreadyExists = await captainModel.findOne({ email });

    if(isCaptainAlreadyExists) {
        return res.status(400).json({ errors: [{ msg: 'Captain already exists' }] });
    }

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstName: fullName.firstName,
        lastName: fullName.lastName,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token= captain.generateAuthToken();

    res.status(200).json({ token, captain });
}



module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if(!captain) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const isPasswordMatch = await captain.comparePassword(password);

    if(!isPasswordMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}


module.exports.getCaptainProfile = async (req, res) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token= req.cookies.token || req.header.authorization.split(' ')[1];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ msg: 'Logged out successfully' });
}
