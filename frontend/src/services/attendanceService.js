import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const attendanceService = {
  // Fetch attendance records by employee ID and date range
  fetchAttendance: async (employeeId, startDate, endDate, token) => {
    try {
      const response = await axios.get(`${BASE_URL}attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          employeeId,
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Failed to fetch attendance records",
        }
      );
    }
  },

  // Check-in
  checkIn: async (employeeId) => {
    try {
      const response = await axios.post(`${BASE_URL}attendance/check-in`, {
        employeeId,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Check-in failed",
        }
      );
    }
  },

  // Check-out
  checkOut: async (employeeId) => {
    try {
      const response = await axios.post(`${BASE_URL}attendance/check-out`, {
        employeeId,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: "Check-out failed",
        }
      );
    }
  },
};

export default attendanceService;
