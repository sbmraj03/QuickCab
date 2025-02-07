const express= require('express');
const { body } = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware= require('../middleswares/auth.middleware')



router.post('/register',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
] , userController.registerUser); 

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
], userController.loginUser);

router.get('/profile',authMiddleware.authUser,userController.getUserProfile)
router.post('/logout',authMiddleware.authUser,userController.logoutUser);


module.exports = router;