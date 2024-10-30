// Login.js
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../components/Loading";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/user/signin",
        formData
      );
      const data = response.data;

      sessionStorage.setItem("token", data.token);

      if (response.status === 200) {
        alert(data.message);
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Signin failed");
      navigate("/signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-md shadow-lg">
        <h2 className="text-3xl font-bold text-center">Sign In</h2>
        <p className="text-sm text-center text-gray-500">
          Enter your credentials to access your account
        </p>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500 focus:border-gray-500"
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-gray-500 focus:border-gray-500"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-500"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <a
            className="text-black underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
