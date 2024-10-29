import { useEffect, useState } from "react";
import axios from "axios";

const useFetchBalance = () => {
  const [balance, setBalance] = useState(0);
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    const getBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/account/balance",
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getBalance();
  }, [token]);
  return balance;
};

export default useFetchBalance;
