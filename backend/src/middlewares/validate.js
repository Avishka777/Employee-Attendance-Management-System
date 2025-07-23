const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/apiError');

// Validation schemas
exports.registerSchema = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['employee', 'admin'])
    .withMessage('Invalid role specified')
];

exports.loginSchema = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.updateUserSchema = [
  body('name').optional().trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender specified'),
  body('birthday')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid birthday'),
  body('role')
    .optional()
    .isIn(['employee', 'admin'])
    .withMessage('Invalid role specified')
];

exports.checkInSchema = [
  body('employeeId')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required')
    .matches(/^EMP\d{3}$/)
    .withMessage('Invalid employee ID format')
];

exports.checkOutSchema = [
  body('employeeId')
    .trim()
    .notEmpty()
    .withMessage('Employee ID is required')
    .matches(/^EMP\d{3}$/)
    .withMessage('Invalid employee ID format')
];

// Validation middleware function
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg);
    next(new ApiError(400, errorMessages.join(', ')));
  };
};