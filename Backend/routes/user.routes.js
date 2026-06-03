const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * POST /register - Register a new user
 */
router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userController.registerUser
);

/**
 * POST /login - Login user
 */
router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password invalid')
],
    userController.loginUser
);

/**
 * GET /profile - Get user profile (authenticated)
 */
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

/**
 * GET /logout - Logout user (authenticated)
 */
router.get('/logout', authMiddleware.authUser, userController.logoutUser);

module.exports = router;