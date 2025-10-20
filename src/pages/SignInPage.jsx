import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addHeaderToAxiosConfig } from "../utils/add-header-to-axios-config";

const SignIn = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/users/sign-in", {
        email,
        password,
      });
      if (response.data) {
        addHeaderToAxiosConfig(
          "Authorization",
          "Bearer " + response.data.token
        );
        onLogin(response.data.user);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please check you email and password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-2xl flex items-center justify-center space-x-12">
        {/* Left Side: Form */}
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-4xl font-semibold text-center text-white mb-6">
            Sign In
          </h2>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="text-center mt-4 text-gray-400">
            Don't have an account?{" "}
            <a href="/sign-up" className="text-indigo-400 hover:underline">
              Create Organization
            </a>
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="hidden lg:block w-1/2">
          <img
            src="https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg"
            alt="designer life"
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
