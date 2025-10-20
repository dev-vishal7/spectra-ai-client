import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

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
                  path="/sign-in"
                  element={<SignInPage onLogin={handleLogin} />}
                />
                <Route path="/sign-up" element={<SignUpPage />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute user={user}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Default Route - Redirect based on user authentication */}
                <Route
                  path="*"
                  element={<Navigate to={user ? "/dashboard" : "/sign-in"} />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}

      {/* If user is not logged in, only show the sign-in or sign-up routes */}
      {!user && (
        <Routes>
          <Route
            path="/sign-in"
            element={<SignInPage onLogin={handleLogin} />}
          />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
