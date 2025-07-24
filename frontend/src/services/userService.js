import axios from "axios";

const userService = {
  // Update user profile
  updateProfile: async (userId, userData, token) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}users/${userId}`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: "Profile update failed"
      };
    }
  },

  // Delete user profile
  deleteProfile: async (userId, token) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        success: false,
        message: "Profile deletion failed"
      };
    }
  }
};

export default userService;