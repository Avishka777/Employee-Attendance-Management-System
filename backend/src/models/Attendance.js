const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      ref: "User",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
    },
    workingHours: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["present", "absent", "half-day"],
      default: "present",
    },
  },
  {
    timestamps: true,
  }
);

// Calculate working hours before saving
attendanceSchema.pre("save", function (next) {
  if (this.checkOut) {
    const diff = this.checkOut - this.checkIn;
    this.workingHours = (diff / (1000 * 60 * 60)).toFixed(2); // in hours
  }
  next();
});

module.exports = mongoose.model("Attendance", attendanceSchema);
