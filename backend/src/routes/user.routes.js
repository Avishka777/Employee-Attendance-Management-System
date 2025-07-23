const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { updateUserSchema } = require('../middlewares/validate');

// Get All Users (Admin only)
router.get('/', protect, authorize('admin'), userController.getAllUsers);

// Get User By ID (Admin only)
router.get('/:id', protect, authorize('admin'), userController.getUser);

// Delete User (Admin only)
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

// Deactivate User (Admin only)
router.put('/:id/deactivate', protect, authorize('admin'), userController.deactivateUser);

// User routes (Everyone can access)
router.put('/:id', protect, validate(updateUserSchema), userController.updateUser);

module.exports = router;