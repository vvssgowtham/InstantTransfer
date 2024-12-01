import axios from "axios";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import LoadingOverlay from "../components/Loading";

const SendMoney = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const idValue = searchParams.get("id");
  const name = searchParams.get("name");
  const [transferData, setTransferData] = useState({
    transferTo: idValue,
    amount: "",
  });
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferData.amount || Number(transferData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      setLoading(true);
      console.log(transferData);
      const response = await axios.post(
        "https://instanttransfer.onrender.com/api/v1/account/transfer",
        {
          ...transferData,
          amount: Number(transferData.amount),
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
    setTransferData({ transferTo: idValue, amount: "" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-sm p-6 space-y-6 bg-white rounded-md shadow-lg">
        <h2 className="text-3xl font-bold text-center">Send Money</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white bg-green-500 rounded-full">
            {name ? name.charAt(0).toUpperCase() : "A"}
          </div>
          <p className="text-lg font-medium">{name}</p>
        </div>
        <form className="space-y-4" onSubmit={handleTransfer}>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (in $)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter amount"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500"
              value={transferData.amount || ""}
              onChange={(e) =>
                setTransferData({ ...transferData, amount: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400"
          >
            Initiate Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendMoney;
