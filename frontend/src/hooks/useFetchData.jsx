import { useState, useEffect } from "react";
import axios from "axios";

const useFetchData = () => {
  const [userData, setUserData] = useState(null);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/user/get-user", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserData();
  }, [token]);

  return userData;
};

export default useFetchData;