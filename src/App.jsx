import { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import SignupPage from "./pages/auth/SignupPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookingsPage from "./pages/admin/AdminBookingsPage";
import AdminAmbulancesPage from "./pages/admin/AdminAmbulancesPage";
import AdminDriversPage from "./pages/admin/AdminDriversPage";

import UserDashboard from "./pages/user/UserDashboard";
import UserNewBooking from "./pages/user/UserNewBooking";
import UserMyBookings from "./pages/user/UserMyBookings";

import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverTripsPage from "./pages/driver/DriverTripsPage";
import DriverCompletedTrips from "./pages/driver/DriverCompletedTrips";
import { AuthContext } from "./context";
import ChangePassword from "./pages/auth/ChangePassword";
import LoginPage from "./pages/auth/Loginpage";
import ProfilePage from "./pages/common/ProfilePage";
import EditProfilePage from "./pages/common/EditProfilePage";

function App() {
  const { loading, user } = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-6xl text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <Router>
        <Routes>
          {/* Public Routes */}

          <Route path="/login" element={<LoginPage />} />

          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Application */}

          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/*"
            element={
              user ? (
                <div className="flex flex-col h-screen bg-gray-100">
                  <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                  <div className="flex flex-1 overflow-hidden">
                    <Sidebar
                      isOpen={sidebarOpen}
                      toggleSidebar={() => setSidebarOpen(false)}
                      userRole={user.role}
                    />

                    <main className="flex-1 overflow-auto">
                      <Routes>
                        {/* Dashboard */}
                        <Route
                          path="/profile/me"
                          element={
                            <ProtectedRoute>
                              <ProfilePage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/profile/edit"
                          element={
                            <ProtectedRoute>
                              <EditProfilePage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/dashboard"
                          element={
                            user.role === "admin" ? (
                              <AdminDashboard />
                            ) : user.role === "user" ? (
                              <UserDashboard />
                            ) : (
                              <DriverDashboard />
                            )
                          }
                        />

                        {/* Admin */}

                        <Route
                          path="/admin/bookings"
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <AdminBookingsPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/ambulances"
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <AdminAmbulancesPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/admin/drivers"
                          element={
                            <ProtectedRoute requiredRole="admin">
                              <AdminDriversPage />
                            </ProtectedRoute>
                          }
                        />

                        {/* User */}

                        <Route
                          path="/user/new-booking"
                          element={
                            <ProtectedRoute requiredRole="user">
                              <UserNewBooking />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/user/my-bookings"
                          element={
                            <ProtectedRoute requiredRole="user">
                              <UserMyBookings />
                            </ProtectedRoute>
                          }
                        />

                        {/* Driver */}

                        <Route
                          path="/driver/trips"
                          element={
                            <ProtectedRoute requiredRole="driver">
                              <DriverTripsPage />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/driver/completed"
                          element={
                            <ProtectedRoute requiredRole="driver">
                              <DriverCompletedTrips />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="*"
                          element={<Navigate to="/dashboard" />}
                        />
                      </Routes>
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
