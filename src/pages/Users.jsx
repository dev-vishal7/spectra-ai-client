import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users/get-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      fetchUsers(); // Refresh the table after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-xl shadow-md border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Users List</h2>
        <button
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md text-sm"
          onClick={() => navigate("/users/create")}
        >
          + Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#334155] text-gray-300">
            <tr>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Last Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr className="border-t border-gray-600 hover:bg-[#334155]">
                <td className="px-4 py-2">{user.firstName}</td>
                <td className="px-4 py-2">{user?.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phoneNumber}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button
                    onClick={handleEdit.bind(this, user._id)}
                    className="text-yellow-400 cursor-pointer hover:text-yellow-300"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={handleDelete.bind(this, user._id)}
                    className="text-red-500 cursor-pointer hover:text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
