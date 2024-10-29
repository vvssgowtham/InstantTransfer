import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import SendMoney from "./pages/SendMoney";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = sessionStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={token ? <Navigate to="/" /> : <Signup />} />
        <Route path="/signin" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route
          path="/send-money"
          element={<ProtectedRoute element={<SendMoney />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
