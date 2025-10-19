import { Routes, Route, Navigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  useUser,
} from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import SelectOrganization from "./pages/SelectOrganization";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route
        path="/select-organization"
        element={
          <>
            <SignedIn>
              <SelectOrganization />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <>
            <SignedIn>
              <Dashboard />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}

export default App;
