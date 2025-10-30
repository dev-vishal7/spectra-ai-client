import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import UserForm from "./pages/UserForm";
import SourcesPage from "./pages/SourcesPage";
import FactorySetup from "./pages/FactorySetup";
import ConnectSources from "./pages/ConnectSources";
import ConfigureDashboard from "./pages/ConfigureDashboard";
import ChooseTemplate from "./pages/ChooseTemplate";
import LandingPage from "./pages/landing-page";

function App() {
  const [user, setUser] = useState(null);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); // If logged in, set user state
    }
  }, []);

  // Handle login logic
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
    setUser(userData); // Update state with logged-in user data
  };

  // Handle logout logic
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    setUser(null); // Update state to null on logout
  };

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="bottom-right" />

      {/* Conditionally render Header and Sidebar only if the user is logged in */}
      {user && (
        <>
          <Header user={user} onLogout={handleLogout} />
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 p-6 bg-gray-900">
              <Routes>
                {/* Public Routes */}

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute user={user}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute user={user}>
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/create"
                  element={
                    <ProtectedRoute user={user}>
                      <UserForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users/edit/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <UserForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sources"
                  element={
                    <ProtectedRoute user={user}>
                      <SourcesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard-builder/factory-layout"
                  element={
                    <ProtectedRoute user={user}>
                      <FactorySetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard-builder/connect-sources"
                  element={
                    <ProtectedRoute user={user}>
                      <ConnectSources />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard-builder/choose-template"
                  element={
                    <ProtectedRoute user={user}>
                      <ChooseTemplate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard-builder/configure"
                  element={
                    <ProtectedRoute user={user}>
                      <ConfigureDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="*"
                  element={<Navigate to={user ? "/dashboard" : "/"} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}

      {/* If user is not logged in, only show the sign-in or sign-up routes */}
      {!user && (
        <Routes>
          {/* <Route path="/" element={<LandingPage />} /> */}
          <Route
            path="/sign-in"
            element={<SignInPage onLogin={handleLogin} />}
          />
          <Route
            path="/sign-up"
            element={<SignUpPage onLogin={handleLogin} />}
          />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
