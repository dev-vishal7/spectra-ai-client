import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Building2, ArrowRight } from "lucide-react";
import axios from "axios";

export default function SelectOrganization() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/organizations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrganizations(response.data.organizations);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      setLoading(false);
    }
  };

  const selectOrganization = async (orgId) => {
    localStorage.setItem("selectedOrgId", orgId);
    navigate("/dashboard");
  };

  const createNewOrganization = () => {
    navigate("/create-organization");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Select Organization
          </h1>
          <p className="text-slate-400">Choose where to continue</p>
        </div>

        <div className="space-y-3">
          {organizations.map((org) => (
            <button
              key={org.id}
              onClick={() => selectOrganization(org.id)}
              className="w-full p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition">
                    {org.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Role: {org.role} • {org.memberCount} users
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition" />
              </div>
            </button>
          ))}

          <button
            onClick={createNewOrganization}
            className="w-full p-6 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-2xl hover:border-cyan-500 hover:bg-slate-800/50 transition-all text-center group"
          >
            <Building2 className="w-8 h-8 text-slate-600 group-hover:text-cyan-400 transition mx-auto mb-2" />
            <p className="text-slate-400 group-hover:text-white transition">
              Create New Organization
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
