import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoadingOverlay from "../components/Loading";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://instanttransfer.onrender.com/api/v1/user/signup",
        formData
      );
      const data = response.data;
      localStorage.setItem("token", data.token);
      if (response.status === 201) {
        alert(data.message);
        navigate("/");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
    setFormData({ firstName: "", lastName: "", userName: "", password: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      {loading && <LoadingOverlay />}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your information to create an account
        </p>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="email"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="johndoe@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
