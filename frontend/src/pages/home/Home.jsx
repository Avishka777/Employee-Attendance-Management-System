import Swal from "sweetalert2";
import dark from "../../assets/background/dark.png";
import light from "../../assets/background/light.png";
import attendanceService from "../../services/attendanceService";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Card, TextInput, Button } from "flowbite-react";
import { HiCheckCircle, HiXCircle, HiClock } from "react-icons/hi";
import Cubes from "../../components/public/Cubes";

const Home = () => {
  const { theme } = useSelector((state) => state.theme);
  const heroBg = theme === "dark" ? dark : light;

  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAttendance = async (type) => {
    if (!employeeId.trim()) {
      return Swal.fire("Missing Field", "Please enter Employee ID", "warning");
    }

    setLoading(true);
    try {
      const res =
        type === "check-in"
          ? await attendanceService.checkIn(employeeId)
          : await attendanceService.checkOut(employeeId);

      if (res.success) {
        Swal.fire("Success", res.message || `${type} successful`, "success");
        setEmployeeId("");
      } else {
        Swal.fire("Error", res.message || "Something went wrong", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-100 dark:bg-gray-900 min-h-screen">
        {/* Hero Section */}
        <section
          className="relative w-full h-screen bg-cover bg-center overflow-y-auto flex items-center justify-center px-4"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          {/* Cubes background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <Cubes
              gridSize={8}
              maxAngle={60}
              radius={4}
              borderStyle="2px dashed #5227FF"
              faceColor={theme === "dark" ? "#1a1a2e" : "#ffffff10"}
              rippleColor="#ff6b6b"
              rippleSpeed={1.5}
              autoAnimate={true}
              rippleOnClick={true}
            />
          </div>

          {/* Attendance Card */}
          <Card className="relative z-10 w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
              Employee Attendance
            </h3>

            <div className="space-y-4">
              <TextInput
                type="text"
                placeholder="Enter Employee ID (e.g. EMP001)"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="mb-4"
                icon={HiClock}
              />

              <div className="flex gap-4 justify-center">
                <Button
                  gradientDuoTone="greenToBlue"
                  isProcessing={loading}
                  onClick={() => handleAttendance("check-in")}
                  disabled={!employeeId.trim()}
                  className="flex-1"
                >
                  <HiCheckCircle className="mr-2 h-5 w-5" />
                  Check In
                </Button>
                <Button
                  gradientDuoTone="pinkToOrange"
                  isProcessing={loading}
                  onClick={() => handleAttendance("check-out")}
                  disabled={!employeeId.trim()}
                  className="flex-1"
                >
                  <HiXCircle className="mr-2 h-5 w-5" />
                  Check Out
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Home;
