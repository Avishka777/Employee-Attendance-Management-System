import Swal from "sweetalert2";
import Loading from "../../components/public/Loading";
import userService from "../../services/userService";
import attendanceService from "../../services/attendanceService";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { Table, Select, Label } from "flowbite-react";

const Attendance = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users to populate dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userService.getAllUsers(token);
        if (response.success) {
          setUsers(response.data);
        } else {
          setUsers([]);
          Swal.fire(
            "Error",
            response.message || "Failed to fetch users",
            "error"
          );
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Something went wrong", "error");
      }
    };
    fetchUsers();
  }, []);

  // Fetch attendance by filter
  const fetchAttendance = async () => {
    if (!selectedEmployeeId || !startDate || !endDate) {
      return Swal.fire(
        "Missing Fields",
        "Please select employee and date range",
        "warning"
      );
    }

    setLoading(true);
    try {
      const data = await attendanceService.fetchAttendance(
        selectedEmployeeId,
        startDate,
        endDate,
        token
      );

      if (data.success) {
        setAttendance(data.data);
      } else {
        Swal.fire(
          "Error",
          data.message || "Failed to fetch attendance",
          "error"
        );
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
        Attendance Report
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <Label htmlFor="employee" value="Select Employee" />
          <Select
            id="employee"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            required
            className="mt-1"
          >
            <option value="">-- Choose Employee --</option>
            {users.map((user) => (
              <option key={user._id} value={user.employeeId}>
                {user.name} ({user.employeeId})
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="startDate" value="Start Date" />
          <TextInput
            className="mt-1"
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="endDate" value="End Date" />
          <TextInput
            className="mt-1"
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button onClick={fetchAttendance} className="w-full">
            Get Report
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <Loading />
          <p className="text-gray-500 mt-4 font-semibold text-lg">
            Fetching Attendance...
          </p>
        </div>
      ) : (
        // Attendance Table
        <Table
          hoverable
          className="w-full text-sm text-gray-700 dark:text-gray-200"
        >
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Check-In Time</Table.HeadCell>
            <Table.HeadCell>Check-Out Time</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Employee</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {attendance.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan="4" className="text-center py-4">
                  No attendance records found.
                </Table.Cell>
              </Table.Row>
            ) : (
              attendance.map((record) => (
                <Table.Row key={record._id}>
                  <Table.Cell>
                    {new Date(record.date).toISOString().split("T")[0]}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(record.checkIn).toLocaleTimeString()}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(record.checkOut).toLocaleTimeString()}
                  </Table.Cell>
                  <Table.Cell className="capitalize">
                    {record.status}
                  </Table.Cell>
                  <Table.Cell>
                    {record.employee.name} ({record.employee.employeeId})
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      )}
    </DashboardLayout>
  );
};

export default Attendance;
