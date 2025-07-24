import Swal from "sweetalert2";
import userService from "../../services/userService";
import Loading from "../../components/public/Loading";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TextInput, Table } from "flowbite-react";

const AllUserList = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the user.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const response = await userService.deleteProfile(userId, token);
        if (response.success) {
          setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
          Swal.fire(
            "Deleted!",
            response.message || "User has been deleted.",
            "success"
          );
        } else {
          Swal.fire("Error", response.message || "Deletion failed", "error");
        }
      } catch (err) {
        Swal.fire("Error", err.message || "Something went wrong", "error");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center mt-40">
          <Loading />
          <p className="text-gray-600 mt-10 font-semibold text-xl">
            Loading Users...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-cyan-600">All Users</h2>
        <TextInput
          icon={Search}
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-96 rounded-lg"
        />
      </div>

      <Table hoverable className="text-gray-900 dark:text-gray-300 w-full">
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Employee ID</Table.HeadCell>
          <Table.HeadCell>Gender</Table.HeadCell>
          <Table.HeadCell>Birthday</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {filteredUsers.map((user) => (
            <Table.Row key={user._id}>
              <Table.Cell>{user.name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell className="capitalize">{user.role}</Table.Cell>
              <Table.Cell>{user.employeeId}</Table.Cell>
              <Table.Cell className="capitalize">{user.gender}</Table.Cell>
              <Table.Cell>
                {new Date(user.birthday).toISOString().split("T")[0]}
              </Table.Cell>
              <Table.Cell
                className={user.isActive ? "text-green-500" : "text-red-500"}
              >
                {user.isActive ? "Active" : "Inactive"}
              </Table.Cell>
              <Table.Cell>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </DashboardLayout>
  );
};

export default AllUserList;
