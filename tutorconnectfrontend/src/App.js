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
// New import for participant dashboard
import ParticipantDashboard from "./components/ParticipantDashboard";
import Index from "./Website/components/Index";
import LoginForm from "./registration/LoginForm";
import UnauthorizedPage from "./Unauthorized/UnauthorizedPage";
import CreateUserForm from "./components/users/CreateUserForm";
import UserManagement from "./components/users/UserManagement";
import RoomsList from "./room/RoomsList";
import AddRoom from "./room/AddRoom";
import RoomView from "./room/RoomView";
import EditRoom from "./room/EditRoom";
import TutorRoomsList from "./room/TutorRoomsList";

import TicketList from "./components/services/TicketList";
import TicketDetail from "./components/services/TicketDetail";
import TicketForm from "./components/services/TicketForm";
import SubscriptionForm from "./Website/SubscriptionForm";
import DemandsList from "./components/Demands/DemandsList";
import DemandDetail from "./components/Demands/DemandDetail";
import RoomRequestForm from "./room/RoomRequestForm";
import RoomManagement from "./room/RoomManagement";
import ParticipantList from "./components/Participants/ParticipantList";
import ParticipantDetail from "./components/Participants/ParticipantDetail";
import ParticipantRoomsList from "./room/ParticipantRoomsList";
import DeliverableList from "./components/Deliverable/DeliverableList";
import CreateDeliverableForm from "./components/Deliverable/CreateDeliverableForm";
import DeliverableDetail from "./components/Deliverable/DeliverableDetail";
import GradeDeliverableForm from "./components/Deliverable/GradeDeliverableForm";
import ParticipantDeliverables from "./components/Deliverable/ParticipantDeliverables";
import DeliverableView from "./components/Deliverable/DeliverableView";
import SubmitDeliverableForm from "./components/Deliverable/SubmitDeliverableForm";
import ParticipantDeliverablesList from "./components/Deliverable/ParticipantDeliverablesList";
import SessionManagement from "./components/Sessions/SessionManagement";
import SessionForm from "./components/Sessions/SessionForm";
import SessionDetail from "./components/Sessions/SessionDetail";
import ParticipantSessionDetail from "./components/Sessions/ParticipantSessionDetail"
import ParticipantSessionsList from "./components/Sessions/ParticipantSessionsList";
import AttendanceConfirmation from "./components/Sessions/AttendanceConfirmation";
import JoinSession from "./components/Sessions/VideoSessions/JoinSession";


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
        console.log("ROLE FROM BACKEND:", response.data.role); // Add debug log

        // Normalize the role to handle case sensitivity
        const role = response.data.role?.trim().toUpperCase();

        setAuth({
          loading: false,
          isValid: true,
          isAdmin: role === "ADMIN",
        });
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("authToken");
        setAuth({ loading: false, isValid: false, isAdmin: false });
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  if (auth.loading) return <div>Loading...</div>;
  if (!auth.isValid) return <Navigate to="/login" />;
  if (!auth.isAdmin) return <Navigate to="/unauthorized" />;

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

const ProtectedParticipantRoute = ({ children }) => {
  const [auth, setAuth] = useState({
    loading: true,
    isValid: false,
    isParticipant: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosClient.get("/verifyToken");
        console.log("ROLE FROM BACKEND:", response.data.role);

        // Normalize the role comparison
        const role = response.data.role?.trim().toUpperCase();
        const isParticipant = role === "PARTICIPANT" || role === "ROLE_PARTICIPANT";

        setAuth({
          loading: false,
          isValid: true,
          isParticipant,
        });
      } catch (error) {
        console.error("Token verification error:", error);
        localStorage.removeItem("authToken");
        setAuth({ loading: false, isValid: false, isParticipant: false });
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  if (auth.loading) return <div>Loading...</div>;
  if (!auth.isValid) return <Navigate to="/login" />;
  if (!auth.isParticipant) {
    console.log("Not a participant, role was:", auth.role); // Add debug log
    return <Navigate to="/unauthorized" />;
  }

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
            <Route path="/join-as-tutor" element={<SubscriptionForm />} />
            <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <DashIndex />
                  </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/demands"
                element={
                  <ProtectedAdminRoute>
                    <DemandsList />
                  </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/demands/:id"
                element={
                  <ProtectedAdminRoute>
                    <DemandDetail />
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
            {/* Admin dashboard rooms  */}
            <Route
                path="/admin/rooms"
                element={
                  <ProtectedAdminRoute>
                    <RoomsList />
                  </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/rooms/create"
                element={
                  <ProtectedAdminRoute>
                    <AddRoom />
                  </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/rooms/:id"
                element={
                  <ProtectedAdminRoute>
                    <RoomView />
                  </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/rooms/edit/:id"
                element={
                  <ProtectedAdminRoute>
                    <EditRoom />
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

            {/* Tutor Room Management Routes */}
            <Route
                path="/tutor/rooms"
                element={
                  <ProtectedTutorRoute>
                    <TutorRoomsList />
                  </ProtectedTutorRoute>
                }
            />
            <Route
                path="/tutor/rooms/request"
                element={
                  <ProtectedTutorRoute>
                    <RoomRequestForm />
                  </ProtectedTutorRoute>
                }
            />
            <Route
                path="/tutor/rooms/:id/manage"
                element={
                  <ProtectedTutorRoute>
                    <RoomManagement />
                  </ProtectedTutorRoute>
                }
            />
            <Route
                path="/tutor/rooms/:roomId/participants"
                element={
                  <ProtectedTutorRoute>
                    <ParticipantList />
                  </ProtectedTutorRoute>
                }
            />
            <Route
                path="/tutor/participants/:id"
                element={
                  <ProtectedTutorRoute>
                    <ParticipantDetail />
                  </ProtectedTutorRoute>
                }
            />
            {/* Deliverable Routes for Tutors */}
              <Route
                  path="/tutor/rooms/:roomId/deliverables"
                  element={
                      <ProtectedTutorRoute>
                          <DeliverableList />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/rooms/:roomId/deliverables/create"
                  element={
                      <ProtectedTutorRoute>
                          <CreateDeliverableForm />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/deliverables/:id"
                  element={
                      <ProtectedTutorRoute>
                          <DeliverableDetail />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/deliverables/:id/grade"
                  element={
                      <ProtectedTutorRoute>
                          <GradeDeliverableForm />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/participants/:participantId/deliverables"
                  element={
                      <ProtectedTutorRoute>
                          <ParticipantDeliverablesList />
                      </ProtectedTutorRoute>
                  }
              />
              {/* sessions Routes for Tutors */}

              <Route
                  path="/tutor/rooms/:roomId/sessions"
                  element={
                      <ProtectedTutorRoute>
                          <SessionManagement />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/rooms/:roomId/sessions/create"
                  element={
                      <ProtectedTutorRoute>
                          <SessionForm />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/rooms/:roomId/sessions/:id"
                  element={
                      <ProtectedTutorRoute>
                          <SessionDetail />
                      </ProtectedTutorRoute>
                  }
              />
              <Route
                  path="/tutor/rooms/:roomId/sessions/:id/edit"
                  element={
                      <ProtectedTutorRoute>
                          <SessionForm editMode={true} />
                      </ProtectedTutorRoute>
                  }
              />



            {/* Participant Routes */}
            <Route
                path="/participant/dashboard"
                element={
                  <ProtectedParticipantRoute>
                    <ParticipantDashboard />
                  </ProtectedParticipantRoute>
                }
            />
            <Route
                path="/participant/rooms"
                element={
                  <ProtectedParticipantRoute>

                    <ParticipantRoomsList />
                  </ProtectedParticipantRoute>
                }
            />
              {/* Deliverable Routes for Participants */}
              <Route
                  path="/participant/deliverables"
                  element={
                      <ProtectedParticipantRoute>
                          <ParticipantDeliverables />
                      </ProtectedParticipantRoute>
                  }
              />
              <Route
                  path="/participant/deliverables/:id"
                  element={
                      <ProtectedParticipantRoute>
                          <DeliverableView />
                      </ProtectedParticipantRoute>
                  }
              />
              <Route
                  path="/participant/deliverables/:id/submit"
                  element={
                      <ProtectedParticipantRoute>
                          <SubmitDeliverableForm />
                      </ProtectedParticipantRoute>
                  }
              />
              <Route
                  path="/participant/rooms/:roomId/sessions"
                  element={
                      <ProtectedParticipantRoute>
                          <SessionManagement />
                      </ProtectedParticipantRoute>
                  }
              />
              <Route
                  path="/participant/rooms/:roomId/sessions/:id"
                  element={
                      <ProtectedParticipantRoute>
                          <SessionDetail />
                      </ProtectedParticipantRoute>
                  }
              />

                    <Route
                        path="/participant/participantroom/:roomId/sessions"
                        element={
                            <ProtectedParticipantRoute>
                                <ParticipantSessionsList />
                            </ProtectedParticipantRoute>
                        }
                    />
                    <Route
                        path="/participant/sessions/:sessionId/video"
                        element={
                            <ProtectedParticipantRoute>
                                <JoinSession />
                            </ProtectedParticipantRoute>
                        }
                    />

                    <Route
                        path="/participant/participantroom/:roomId/confirm-attendance"
                        element={
                            <ProtectedParticipantRoute>
                                <AttendanceConfirmation />
                            </ProtectedParticipantRoute>
                        }
                    />

          </Routes>
        </Router>
      </AuthContext.Provider>
  );
}

export default App;