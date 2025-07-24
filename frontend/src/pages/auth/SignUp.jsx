import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { Button, Label } from "flowbite-react";
import { TextInput, Select, Spinner } from "flowbite-react";
import Swal from "sweetalert2";
import logo from "../../assets/public/logo.png";
import authService from "../../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileType: "employee",
    gender: "male",
    birthday: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (formSubmitted && (id === "confirmPassword" || id === "password")) {
      setPasswordMatchError(
        id === "password" && value !== formData.confirmPassword
          ? "Passwords do not match!"
          : id === "confirmPassword" && value !== formData.password
          ? "Passwords do not match!"
          : ""
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!formData.birthday) {
      Swal.fire({
        title: "Missing Information",
        text: "Please select your birthday",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatchError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        profileType: formData.profileType,
        gender: formData.gender,
        birthday: formData.birthday,
      });

      if (!response.success) {
        throw new Error(response.message || "Registration failed");
      }

      const employeeId = response.data?.user?.employeeId;

      await Swal.fire({
        title: "Registration Successful!",
        html: `Your account has been created successfully.<br><strong>Employee ID:</strong> ${employeeId}`,
        icon: "success",
        confirmButtonText: "Continue to Login",
      });

      navigate("/sign-in");
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text: error.message || "An error occurred during registration",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col md:flex-row m-auto border-2 p-10 mx-auto gap-5 max-w-6xl rounded-xl border-cyan-500 py-4">
        {/* Left Column */}
        <div className="flex flex-col md:w-1/2 items-center justify-center mx-8">
          <p className="text-3xl mb-5 text-center font-serif text-cyan-500">
            REGISTRATION FORM
          </p>
          <img src={logo} className="h-28 sm:h-48" alt="Company Logo" />
          <h1 className="text-3xl mt-5 text-center font-serif text-cyan-500">
            EMPLOYEE ATTENDANCE
          </h1>
          <p className="text-lg mt-5 text-center font-serif">
            Efficient employee management system with attendance tracking
          </p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col md:w-1/2">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" value="Full Name" />
              <TextInput
                id="fullName"
                type="text"
                placeholder="Full Name"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Profile Type */}
            <div>
              <Label htmlFor="profileType" value="Profile Type" />
              <Select
                id="profileType"
                required
                value={formData.profileType}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </Select>
            </div>

            <div className="flex flex-row gap-4">
              {/* Gender */}
              <div className="w-full">
                <Label htmlFor="gender" value="Gender" />
                <Select
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>

              {/* Birthday */}
              <div className="w-full">
                <Label htmlFor="birthday" value="Birthday" />
                <TextInput
                  id="birthday"
                  type="date"
                  required
                  value={formData.birthday}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]} // Prevent future dates
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <Label htmlFor="password" value="Password" />
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" value="Confirm Password" />
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  minLength="8"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <HiEyeOff size={20} />
                  ) : (
                    <HiEye size={20} />
                  )}
                </button>
              </div>
              {passwordMatchError && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordMatchError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              gradientMonochrome="info"
              disabled={loading || passwordMatchError}
              className="mt-4"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Processing...</span>
                </>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <Link to="/sign-in" className="text-cyan-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
