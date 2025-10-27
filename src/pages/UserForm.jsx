import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`/users/${id}`)
        .then((res) => {
          setFormData({ ...res.data, password: "" });
          setLoading(false);
        })
        .catch((err) => {
          toast.error("Failed to fetch user");
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditMode) {
        delete formData.password;
        await axios.patch(`/users/update/${id}`, formData);
        toast.success("User updated successfully");
      } else {
        await axios.post("/users/create", formData);
        toast.success("User created successfully");
      }
      setTimeout(() => navigate("/users"), 1000);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-300 text-center mt-20 text-sm animate-pulse">
        <Loader2 className="mx-auto animate-spin mb-2" /> Loading user data...
      </div>
    );
  }

  return (
    <div className="bg-[#0f172a] text-white p-8 rounded-xl shadow-2xl border border-gray-700 max-w-4xl mx-auto mt-12">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-8 tracking-wide">
        {isEditMode ? "✏️ Edit User" : "👤 Create New User"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password (only in create mode) */}
        {!isEditMode && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 text-white p-3 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white font-medium transition flex items-center justify-center gap-2 ${
              submitting && "opacity-50 cursor-not-allowed"
            }`}
          >
            {submitting && <Loader2 size={18} className="animate-spin" />}
            {isEditMode ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
