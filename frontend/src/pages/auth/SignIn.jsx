/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/auth/authSlice";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import Swal from "sweetalert2";
import logo from "../../assets/public/logo.png";
import authService from "../../services/authService";

const Signin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      Swal.fire({
        title: "Missing Fields",
        text: "Please enter both email and password",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.success) {
        dispatch(
          loginSuccess({
            token: response.data.token,
            user: response.data.user,
          })
        );

        await Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${response.data.user.name}!`,
          icon: "success",
          confirmButtonText: "Continue",
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col md:flex-row m-auto border-2 p-10 mx-auto gap-5 max-w-6xl rounded-xl border-cyan-500">
        {/* Left Section */}
        <div className="flex flex-col md:w-1/2 items-center justify-center mx-8">
          <img src={logo} className="h-28 sm:h-48" alt="Company Logo" />
          <h1 className="text-3xl mt-5 text-center font-serif text-cyan-500">
            EMPLOYEE ATTENDANCE
          </h1>
          <p className="text-lg mt-5 text-center font-serif">
            Efficient employee management system with attendance tracking
          </p>
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-center text-cyan-500">
            SIGN IN
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                type="email"
                placeholder="your@email.com"
                id="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                type="password"
                placeholder="••••••••"
                id="password"
                required
                minLength="8"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              gradientMonochrome="info"
              disabled={loading}
              className="mt-2"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span>Don't have an account? </span>
            <Link
              to="/sign-up"
              className="text-cyan-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
