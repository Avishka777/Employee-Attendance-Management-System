import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/public/Header";
import Footers from "./components/public/Footer";
import Home from "./pages/home/Home";
import Signin from "./pages/auth/SignIn";
import Signup from "./pages/auth/SignUp";
import MyProfile from "./pages/auth/MyProfile";
import ProtectedRoute from "./components/public/ProtectedRoute";
import AllUserList from "./pages/dashboard/AllUserList";

function Layout() {
  const location = useLocation();
  const hideHeaderFooter = ["/sign-in", "/sign-up"].includes(location.pathname);

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/my-profile" element={<MyProfile />} />

        <Route path="/dashboard/users" element={<AllUserList />} />

        {/* Protected Recruiter Routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
      
        </Route>

      </Routes>
      {!hideHeaderFooter && <Footers />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
