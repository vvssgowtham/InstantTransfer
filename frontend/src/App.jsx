import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

const Signup = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const SendMoney = lazy(() => import("./pages/SendMoney"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoadingOverlay = lazy(() => import("./components/Loading"));

function App() {
  const token = sessionStorage.getItem("token");

  return (
    <Router>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route
            path="/signup"
            element={token ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/signin"
            element={token ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={<ProtectedRoute element={<Dashboard />} />}
          />
          <Route
            path="/send-money"
            element={<ProtectedRoute element={<SendMoney />} />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
