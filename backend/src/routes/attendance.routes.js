const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { checkInSchema, checkOutSchema } = require('../middlewares/validate');

// Check In
router.post('/check-in', validate(checkInSchema), attendanceController.checkIn);

// Check Out
router.post('/check-out', validate(checkOutSchema), attendanceController.checkOut);

// Get My Attendance
router.get('/me', protect, attendanceController.getMyAttendance);

// Get Attendance Summary
router.get('/summary', protect, attendanceController.getAttendanceSummary);

// Admin routes
router.get('/', protect, authorize('admin'), attendanceController.getAllAttendance);

module.exports = router;