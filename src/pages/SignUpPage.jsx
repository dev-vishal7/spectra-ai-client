import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [orgName, setOrgName] = useState(""); // Business Name
  const [email, setEmail] = useState(""); // Admin Email (Single)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("https://your-api.com/create-org", {
        orgName,
        email,
        password,
        phoneNumber,
      });

      if (response.data.success) {
        // After successful organization creation, auto-login
        const loginResponse = await axios.post("https://your-api.com/login", {
          email,
          password,
        });
        if (loginResponse.data.success) {
          navigate("/dashboard"); // Redirect to dashboard
        }
      } else {
        setError("Organization creation failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-2xl flex items-center justify-center space-x-12">
        {/* Left Side: Form */}
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-semibold text-center text-white mb-6">
            Create Your Account
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Set up your organization to get started!
          </p>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Business Name */}
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Business Name"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Email & Phone Number Row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Business Email"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
            >
              Submit
            </button>
          </form>

          <p className="text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <a href="/sign-in" className="text-indigo-400 hover:underline">
              Sign in
            </a>
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="hidden lg:block w-1/2">
          <img
            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
            alt="business creation"
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
