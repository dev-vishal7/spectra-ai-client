import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/dashboard-new";
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
import DashboardPreview from "./pages/DashboardPreview";
import FactoryLayout from "./pages/FactorySetup";
import WorkflowEditor from "./pages/WorkflowEditor";
import LayoutsPage from "./pages/LayoutsPage";
import Pipelines from "./pages/pipeline";
import PipelineEditor from "./pages/pipeline/Editor";
import CommandCenterDark from "./pages/command-center";
import AppsPage from "./pages/AppsPage";
import IntegrationStatusPage from "./pages/IntegrationStatusPage";
import ConfigureIntegrationPage from "./pages/ConfigureIntegrationPage";

function App() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); // If logged in, set user state
    }
  }, []);

  const HIDE_SIDEBAR_ROUTES = ["/builder"];
  // Note: /pipelines/create and /pipelines/edit/:id also contain "/pipelines", preventing sidebar there? 
  // If the user wants sidebar on pipelines list but not detailed editor, precise check needed.
  // Assuming existing logic is desired.
  const showSidebar = !HIDE_SIDEBAR_ROUTES.some((r) =>
    location.pathname.includes(r)
  );

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
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Toaster position="bottom-right" />

      {/* Authenticated Layout: Sidebar Left, Header+Content Right */}
      {user ? (
        <>
          {showSidebar && <Sidebar />}
          
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Header Sticky at Top of Right Column */}
            <Header user={user} onLogout={handleLogout} />
            
            {/* Scrollable Main Content */}
            <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
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
                  path="/command-center"
                  element={
                    <ProtectedRoute user={user}>
                      <CommandCenterDark />
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
                  path="/layouts"
                  element={
                    <ProtectedRoute user={user}>
                      <LayoutsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pipelines"
                  element={
                    <ProtectedRoute user={user}>
                      <Pipelines />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pipelines/create"
                  element={
                    <ProtectedRoute user={user}>
                      <PipelineEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/pipelines/edit/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <PipelineEditor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apps"
                  element={
                    <ProtectedRoute user={user}>
                      <AppsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apps/:appId/status"
                  element={
                    <ProtectedRoute user={user}>
                      <IntegrationStatusPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/apps/:appId/configure"
                  element={
                    <ProtectedRoute user={user}>
                      <ConfigureIntegrationPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="builder">
                  <Route path="factory-layout" element={<FactoryLayout />} />
                  <Route
                    path="factory-layout/:id"
                    element={<FactoryLayout />}
                  />
                  <Route path="choose-template" element={<ChooseTemplate />} />
                  <Route path="configure" element={<ConfigureDashboard />} />
                </Route>

                <Route path="dashboard">
                  <Route path="preview/:id" element={<DashboardPreview />} />
                  {/* <Route path="view/:id" element={<LiveDashboardView />} /> */}
                  {/* <Route index element={<DashboardList />} /> */}
                </Route>

                <Route
                  path="*"
                  element={<Navigate to={user ? "/dashboard" : "/"} />}
                />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        /* Non-Authenticated Layout: Full Screen Routes */
        <div className="w-full h-full overflow-y-auto">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/sign-in"
              element={<SignInPage onLogin={handleLogin} />}
            />
            <Route
              path="/sign-up"
              element={<SignUpPage onLogin={handleLogin} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

export default App;
