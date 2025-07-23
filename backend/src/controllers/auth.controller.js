const User = require("../models/User");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { generateToken } = require("../utils/token");

// Register User
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, gender, birthday } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already in use");
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      gender,
      birthday: new Date(birthday),
      role: role || "employee",
    });

    // Generate token
    const token = generateToken(user._id, user.role);

    // Set last login
    user.lastLogin = new Date();
    await user.save();

    new ApiResponse(201, "User registered successfully", { user, token }).send(
      res
    );
  } catch (error) {
    next(error);
  }
};

// Login User
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(403, "Account is deactivated");
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    new ApiResponse(200, "Login successful", { user, token }).send(res);
  } catch (error) {
    next(error);
  }
};

// Get Current User Details
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    new ApiResponse(200, "User retrieved successfully", user).send(res);
  } catch (error) {
    next(error);
  }
};
