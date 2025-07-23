const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');
const { validate, registerSchema, loginSchema } = require('../middlewares/validate');

// Register User
router.post('/register', validate(registerSchema), authController.register);

// Login User
router.post('/login', validate(loginSchema), authController.login);

// Get Current User Details
router.get('/me', protect, authController.getMe); 

module.exports = router;