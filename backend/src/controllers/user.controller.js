const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    new ApiResponse(200, 'Users retrieved successfully', users).send(res);
  } catch (error) {
    next(error);
  }
};

// Get User By ID
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    new ApiResponse(200, 'User retrieved successfully', user).send(res);
  } catch (error) {
    next(error);
  }
};

// Update User
exports.updateUser = async (req, res, next) => {
  try {
    // Check if user is updating their own profile or is admin
    if (req.params.id !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Not authorized to update this user');
    }

    const updates = {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      birthday: req.body.birthday
    };

    // Only allow role update for admins
    if (req.user.role === 'admin' && req.body.role) {
      updates.role = req.body.role;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    new ApiResponse(200, 'User updated successfully', user).send(res);
  } catch (error) {
    next(error);
  }
};

//Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.user.id) {
      throw new ApiError(400, 'You cannot delete your own account');
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    new ApiResponse(200, 'User deleted successfully').send(res);
  } catch (error) {
    next(error);
  }
};

// Deactivate User
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    new ApiResponse(200, 'User deactivated successfully', user).send(res);
  } catch (error) {
    next(error);
  }
};