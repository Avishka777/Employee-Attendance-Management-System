import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/auth/authSlice";
import { Button, Label, Select, Spinner, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
import userService from "../../services/userService";

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "male",
    birthday: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    if (!token || !user) {
      navigate("/sign-in");
      return;
    }

    setFormData({
      fullName: user.name || "",
      email: user.email || "",
      gender: user.gender || "male",
      birthday: user.birthday ? user.birthday.split("T")[0] : "",
    });
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: formData.fullName,
        email: formData.email,
        gender: formData.gender,
        birthday: formData.birthday,
      };

      await userService.updateProfile(user._id, updateData, token);

      // Update Redux store with new user data
      dispatch(
        loginSuccess({
          token,
          user: {
            ...user,
            ...updateData,
          },
        })
      );
      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update profile",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen mt-16">
      <div className="rounded-lg shadow-md p-6 border border-cyan-500">
        <h1 className="text-2xl font-bold text-cyan-600 mb-6">My Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" value="Full Name" />
            <TextInput
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender" value="Gender" />
            <Select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="birthday" value="Birthday" />
            <TextInput
              id="birthday"
              name="birthday"
              type="date"
              value={formData.birthday}
              onChange={handleChange}
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" gradientMonochrome="info" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
