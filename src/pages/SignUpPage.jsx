import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addHeaderToAxiosConfig } from "../utils/add-header-to-axios-config";
import { setCookie } from "../utils/cookie";

const SignUp = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    orgName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      orgName,
      password,
      confirmPassword,
    } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/tenant/create", {
        firstName,
        lastName,
        tenantName: orgName,
        email,
        password,
        phoneNumber,
      });
      if (response.data) {
        const loginResponse = await axios.post("/users/sign-in", {
          email,
          password,
        });

        if (loginResponse.data) {
          addHeaderToAxiosConfig(
            "Authorization",
            "Bearer " + loginResponse.data.token
          );
          setCookie("Authorization", "Bearer " + loginResponse.data.token);

          onLogin(loginResponse.data.user);
          navigate("/dashboard");
        }
      } else {
        setError("Organization creation failed");
      }
    } catch (err) {
      console.log("err", err);
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
            <input
              type="text"
              name="orgName"
              value={formData.orgName}
              onChange={onChange}
              placeholder="Business Name"
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {/* Email & Phone Number Row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Business Email"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
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
            <a href="/ai/sign-in" className="text-indigo-400 hover:underline">
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
