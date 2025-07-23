const Attendance = require("../models/Attendance");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

// Check-in Employee
exports.checkIn = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    // Verify employee exists
    const employee = await User.findOne({ employeeId });
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today },
    });

    if (existingAttendance) {
      throw new ApiError(400, "Already checked in today");
    }

    // Create attendance record
    const attendance = await Attendance.create({
      employeeId,
      checkIn: new Date(),
    });

    new ApiResponse(201, "Checked in successfully", attendance).send(res);
  } catch (error) {
    next(error);
  }
};

// Check-out Employee
exports.checkOut = async (req, res, next) => {
  try {
    const { employeeId } = req.body;

    // Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: today },
      checkOut: { $exists: false },
    });

    if (!attendance) {
      throw new ApiError(
        400,
        "No active check-in found or already checked out"
      );
    }

    // Update check-out time
    attendance.checkOut = new Date();
    await attendance.save();

    new ApiResponse(200, "Checked out successfully", attendance).send(res);
  } catch (error) {
    next(error);
  }
};

// Get All Attendance Records (Admin)
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    const filter = {};

    // Date filtering
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Employee filtering
    if (employeeId) {
      // Verify the employee exists
      const user = await User.findOne({ employeeId });
      if (!user) {
        throw new ApiError(404, "Employee not found");
      }
      filter.employeeId = employeeId;
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(filter).sort({
      date: -1,
      checkIn: -1,
    });

    // Enrich with user details manually
    const enrichedRecords = await Promise.all(
      attendanceRecords.map(async (record) => {
        const user = await User.findOne({
          employeeId: record.employeeId,
        }).select("name email role employeeId");
        return {
          ...record.toObject(),
          employee: user || null,
        };
      })
    );

    new ApiResponse(200, "Attendance records retrieved", enrichedRecords).send(
      res
    );
  } catch (error) {
    next(error);
  }
};

// Get My Attendance
exports.getMyAttendance = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { employeeId: req.user.employeeId };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(filter).sort({
      date: -1,
      checkIn: -1,
    });

    new ApiResponse(200, "Your attendance records", attendance).send(res);
  } catch (error) {
    next(error);
  }
};

// Get Attendance Summary
exports.getAttendanceSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const employeeId =
      req.user.role === "admin" ? req.query.employeeId : req.user.employeeId;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.aggregate([
      {
        $match: {
          employeeId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "present"] }, 1, 0],
            },
          },
          absentDays: {
            $sum: {
              $cond: [{ $eq: ["$status", "absent"] }, 1, 0],
            },
          },
          totalHours: { $sum: "$workingHours" },
        },
      },
    ]);

    const summary = attendance[0] || {
      totalDays: 0,
      presentDays: 0,
      absentDays: 0,
      totalHours: 0,
    };

    new ApiResponse(200, "Attendance summary", summary).send(res);
  } catch (error) {
    next(error);
  }
};
