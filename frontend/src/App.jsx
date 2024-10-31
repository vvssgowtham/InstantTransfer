import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import { useNavigate } from "react-router-dom";

const Signup = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const SendMoney = lazy(() => import("./pages/SendMoney"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LoadingOverlay = lazy(() => import("./components/Loading"));

function RedirectIfAuthenticated({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return children;
}

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          <Route
            path="/signup"
            element={
              <RedirectIfAuthenticated>
                <Signup />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path="/signin"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
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
