import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axiosClient from "./api/axiosClient";
// Pages & Components
import DashIndex from "./components/DashIndex";

// tutor dashboard created in ./components
// added by maaroufi
import TutorDashboard from "./components/TutorDashboard";
import Index from "./Website/components/Index";
import LoginForm from "./registration/LoginForm";
import UnauthorizedPage from "./Unauthorized/UnauthorizedPage";
import CreateUserForm from "./components/users/CreateUserForm";
import UserManagement from "./components/users/UserManagement";
import RoomsList from "./room/RoomsList";
import AddRoom from "./room/AddRoom";
import RoomView from "./room/RoomView";
import EditRoom from "./room/EditRoom";
import TicketList from "./components/services/TicketList";
import TicketDetail from "./components/services/TicketDetail";
import TicketForm from "./components/services/TicketForm";

const AuthContext = React.createContext();

const ProtectedAdminRoute = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isValid: false,
    isAdmin: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosClient.get("/verifyToken");
        setAuth({
          loading: false,
          isValid: true,
          isAdmin: response.data.role === "ADMIN",
        });
      } catch (error) {
        localStorage.removeItem("authToken");
        setAuth({ loading: false, isValid: false, isAdmin: false });
        console.log("Error verifying token:", error);
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);
  if (auth.loading) return <div>Loading...</div>;
  if (!auth.isValid) return <Navigate to="/login" />;
  if (!auth.isAdmin) return <Navigate to="/" />;

  return children;
};

const ProtectedTutorRoute = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isValid: false,
    isTutor: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosClient.get("/verifyToken");
        console.log(" ROLE FROM BACKEND:", response.data.role); // <--- DEBUG LOG

        const role = response.data.role?.trim().toUpperCase();

        setAuth({
          loading: false,
          isValid: true,
          isTutor: role === "TUTOR",
        });
      } catch (error) {
        localStorage.removeItem("authToken");
        setAuth({ loading: false, isValid: false, isTutor: false });
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  if (auth.loading) return <div>Loading...</div>;
  if (!auth.isValid) return <Navigate to="/TutorDashboard" />;
  if (!auth.isTutor) return <Navigate to="/unauthorized" />;

  return children;
};

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    user: null,
  });

  const verifyAuth = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        user: null,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/verifyToken", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          isAuthenticated: true,
          isAdmin: userData.role === "ADMIN",
          loading: false,
          user: userData,
        });
      } else {
        localStorage.removeItem("authToken");
        setAuthState({
          isAuthenticated: false,
          isAdmin: false,
          loading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth verification error:", error);
      setAuthState({
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    verifyAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    verifyAuth(); // Re-verify auth state
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthState({
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <DashIndex />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/createuser"
            element={
              <ProtectedAdminRoute>
                <CreateUserForm />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/usermanagement"
            element={
              <ProtectedAdminRoute>
                <UserManagement />
              </ProtectedAdminRoute>
            }
          />

          {/* tutor dashboard route */}

          <Route
            path="/tutor/TutorDashboard"
            element={
              <ProtectedTutorRoute>
                <TutorDashboard />
              </ProtectedTutorRoute>
            }
          />
          <Route
              path="/tutor/tickets"
              element={
                <ProtectedTutorRoute>
                  <TicketList />
                </ProtectedTutorRoute>
              }
          />
          <Route
              path="/tutor/tickets/:id"
              element={
                <ProtectedTutorRoute>
                  <TicketDetail />
                </ProtectedTutorRoute>
              }
          />
          <Route
              path="/tutor/tickets/create"
              element={
                <ProtectedTutorRoute>
                  <TicketForm />
                </ProtectedTutorRoute>
              }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin dashboard rooms  */}
          <Route
            path="/rooms"
            element={
              <ProtectedAdminRoute>
                <RoomsList />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/rooms/create"
            element={
              <ProtectedAdminRoute>
                <AddRoom />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedAdminRoute>
                <RoomsList />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/rooms/:id"
            element={
              <ProtectedAdminRoute>
                <RoomView />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/rooms/edit/:id"
            element={
              <ProtectedAdminRoute>
                <EditRoom />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
