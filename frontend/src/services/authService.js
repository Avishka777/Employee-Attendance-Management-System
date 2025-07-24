import axios from "axios";

const authService = {
  // Register User
  register: async (userData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/register`,
        {
          name: userData.fullName,
          email: userData.email,
          password: userData.password,
          role: userData.profileType,
          gender: userData.gender,
          birthday: userData.birthday,
        }
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Registration failed",
        }
      );
    }
  },

  // Login User
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}auth/login`,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          success: false,
          message: error.message || "Login failed",
        }
      );
    }
  },

  // Get current user profile
  getProfile: async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}auth/me`,
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
        message: "Failed to fetch profile"
      };
    }
  },

  // Logout User
  logout: () => {
    localStorage.removeItem("authToken");
  },
};

export default authService;
