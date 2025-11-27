import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Loader2, Database, ArrowRight } from "lucide-react";
import { integrationService } from "../services/integrations/integrationService";
import toast from "react-hot-toast";

const ConfigureIntegrationPage = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await integrationService.getIntegrationStatus(appId);
        console.log('data',data)
        if (data && data.availableDataOptions) {
          setOptions(data.availableDataOptions);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load configuration options");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [appId]);

  const handleToggle = (model) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.model === model ? { ...opt, checked: !opt.checked } : opt
      )
    );
  };

  const handleFinish = async () => {
    const selectedOptions = options
      .filter((opt) => opt.checked)
      .map((opt) => opt.model);

    if (selectedOptions.length === 0) {
      toast.error("Please select at least one data type to sync");
      return;
    }

    setSubmitting(true);
    try {
      await integrationService.confirmIntegration(appId, { options:selectedOptions });
      toast.success("Integration configured successfully!");
      navigate(`/apps/${appId}/status`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save configuration");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl w-full max-w-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Configure Data Sync
          </h1>
          <p className="text-gray-400">
            Select the data entities you want to sync from {appId}.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleToggle(option.model)}
              className={`
                flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
                ${
                  option.checked
                    ? "bg-blue-500/10 border-blue-500/50"
                    : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                    ${
                      option.checked
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-500"
                    }
                  `}
                >
                  {option.checked && <Check size={12} className="text-white" />}
                </div>
                <span
                  className={`font-medium ${
                    option.checked ? "text-white" : "text-gray-400"
                  }`}
                >
                  {option.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/apps")}
            className="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleFinish}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Finish Setup
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigureIntegrationPage;
