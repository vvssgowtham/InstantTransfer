import { useEffect, useState } from "react";
import axios from "axios";
import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import useFetchBalance from "../hooks/useFetchBalance";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const userData = useFetchData();
  const availableBalance = useFetchBalance();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/get-users",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        const allUsers = response.data;
        const formattedUsers = allUsers.map((user) => ({
          id: user._id,
          name: user.firstName,
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };
    getAllUsers();
  }, [token]);

  const fetchUsers = async (searchValue) => {
    setUsers([]);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/user/bulk?filter=${searchValue}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data.users;
        if (data) {
          const formattedUsers = data.map((user) => ({
            id: user._id,
            name: user.firstName,
          }));
          setUsers(formattedUsers);
        } else {
          setUsers([]);
        }
      } else {
        alert("Error fetching users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("An error occurred while fetching users. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Payments App</h1>
        <div className="flex items-center space-x-2">
          {userData && (
            <>
              <span className="text-gray-600">Hello, {userData.firstName}</span>
              <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
                <span className="font-bold">{userData.firstName.charAt(0)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Your Balance</h2>
        <p className="text-xl font-bold text-gray-800">${availableBalance}</p>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchUsers(e.target.value);
          }}
        />
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full">
                    <span className="font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800">{user.name}</span>
                </div>
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg"
                  onClick={() => {
                    navigate(
                      "/send-money?id=" + user.id + "&name=" + user.name
                    );
                  }}
                >
                  Send Money
                </button>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;