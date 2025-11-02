import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Factory,
  Zap,
  Droplets,
  Wind,
  Thermometer,
  Activity,
  Package,
  Truck,
  Building2,
  ShoppingCart,
  Heart,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// Domain Categories
const DOMAINS = [
  {
    id: "manufacturing",
    name: "Manufacturing & Production",
    icon: Factory,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    prompts: [
      "Show temperature trends for all motors with alerts above 80°C",
      "Monitor production line efficiency with downtime analysis",
      "Track OEE metrics across all production units",
    ],
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    icon: Zap,
    color: "yellow",
    gradient: "from-yellow-500 to-orange-500",
    prompts: [
      "Display power consumption trends with peak hour analysis",
      "Monitor renewable energy generation vs grid consumption",
      "Track energy efficiency across all facilities",
    ],
  },
  {
    id: "water",
    name: "Water Management",
    icon: Droplets,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    prompts: [
      "Monitor water flow rates with leak detection alerts",
      "Track water quality parameters across all zones",
      "Display reservoir levels with consumption forecasts",
    ],
  },
  {
    id: "hvac",
    name: "HVAC & Climate",
    icon: Wind,
    color: "teal",
    gradient: "from-teal-500 to-green-500",
    prompts: [
      "Show temperature and humidity across all zones",
      "Monitor HVAC system efficiency with energy usage",
      "Track indoor air quality with CO2 levels",
    ],
  },
  {
    id: "general",
    name: "General IoT",
    icon: Thermometer,
    color: "violet",
    gradient: "from-violet-500 to-purple-500",
    prompts: [
      "Monitor all sensor data with custom alerts",
      "Track device health with connectivity status",
      "Display data trends with historical analysis",
    ],
  },
];

const ConfigureDashboard = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [processing, setProcessing] = useState(false);
  const [generatedDashboardId, setGeneratedDashboardId] = useState(null);
  const [error, setError] = useState(null);
  const [layoutId, setLayoutId] = useState(null);
  const [layoutInfo, setLayoutInfo] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Get layout and template from previous steps
    const storedLayoutId = localStorage.getItem("currentLayoutId");
    const builderState = JSON.parse(
      localStorage.getItem("dashboardBuilderState") || "{}"
    );

    if (!storedLayoutId) {
      toast.error("Layout not found. Please start from factory setup.");
      navigate("/builder/factory-layout");
      return;
    }

    setLayoutId(storedLayoutId);
    setSelectedTemplate(builderState.template);

    // Load layout details
    loadLayoutInfo(storedLayoutId);
  }, []);

  const loadLayoutInfo = async (layoutId) => {
    try {
      const response = await axios.get(`/dashboard/layout/${layoutId}`);
      setLayoutInfo(response.data.layout);
    } catch (error) {
      console.error("Load layout error:", error);
      toast.error("Failed to load layout information");
    }
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setUserPrompt("");
    setGeneratedDashboardId(null);
    setError(null);
  };

  const handlePromptSelect = (prompt) => {
    setUserPrompt(prompt);
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      toast.error("Please describe what you want to see in your dashboard");
      return;
    }

    if (!layoutId) {
      toast.error("Layout not found. Please start from factory setup.");
      navigate("/builder/factory-layout");
      return;
    }

    if (!selectedTemplate) {
      toast.error(
        "Template not selected. Please go back and choose a template."
      );
      navigate("/builder/choose-template");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Call AI generation endpoint
      const response = await axios.post("/dashboard/generate", {
        prompt: userPrompt,
        template: selectedTemplate,
        layoutId: layoutId,
      });

      setGeneratedDashboardId(response.data.dashboard._id);
      toast.success("Dashboard generated successfully!");

      // Wait a moment for user to see success, then redirect to preview
      setTimeout(() => {
        navigate(`/dashboard/preview/${response.data.dashboard._id}`);
      }, 1500);
    } catch (err) {
      console.error("Generation error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to generate dashboard. Please try again."
      );
      toast.error("Failed to generate dashboard");
    } finally {
      setProcessing(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedDashboardId(null);
    setError(null);
    setUserPrompt("");
  };

  const selectedDomainData = DOMAINS.find((d) => d.id === selectedDomain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="text-yellow-400 animate-pulse" size={32} />
              AI Dashboard Generator
            </h1>
            <p className="text-slate-400">
              Powered by OpenAI GPT-4 • Describe your needs in natural language
            </p>
          </div>
          <button
            onClick={() => navigate("/builder/choose-template")}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition border border-slate-600"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Context Info */}
        {layoutInfo && (
          <div className="mt-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Factory size={16} className="text-blue-400" />
                <span className="text-slate-400">Layout:</span>
                <span className="text-white font-medium">
                  {layoutInfo.name}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-green-400" />
                <span className="text-slate-400">Items:</span>
                <span className="text-white font-medium">
                  {layoutInfo.items?.length || 0}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-slate-400">Template:</span>
                <span className="text-white font-medium capitalize">
                  {selectedTemplate?.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Domain Selection */}
        {!selectedDomain && !generatedDashboardId && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Choose Your Domain
              </h2>
              <p className="text-slate-400">
                Select the domain that best matches your use case to get
                AI-optimized suggestions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {DOMAINS.map((domain) => {
                const Icon = domain.icon;
                return (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainSelect(domain.id)}
                    className="group relative bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`}
                    ></div>

                    <div className="relative">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${domain.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="text-white" size={28} />
                      </div>
                      <h3 className="text-white font-bold mb-1 text-left">
                        {domain.name}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Input Section */}
        {selectedDomain && !generatedDashboardId && (
          <div className="space-y-6">
            {/* Selected Domain Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const Icon = selectedDomainData.icon;
                    return (
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${selectedDomainData.gradient} rounded-xl flex items-center justify-center`}
                      >
                        <Icon className="text-white" size={32} />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {selectedDomainData.name}
                    </h2>
                    <p className="text-slate-300">
                      AI will analyze your layout and generate an optimized
                      dashboard
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDomain(null)}
                  className="text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition"
                >
                  Change Domain
                </button>
              </div>
            </div>

            {/* Main Input */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2 text-lg">
                <Sparkles className="text-yellow-400" size={24} />
                Describe Your Dashboard
              </label>
              <p className="text-slate-400 mb-4">
                Tell AI what you want to see. Be specific about metrics, time
                ranges, alerts, and visualizations. AI will automatically map
                your requirements to available data sources from your layout.
              </p>

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Example: Show me temperature trends for all motors in the last 24 hours with alerts when temperature exceeds 80 degrees. Include gauges for current values and a line chart for historical data. Also add humidity monitoring and alert me if it drops below 40%..."
                rows={6}
                disabled={processing}
                className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 disabled:opacity-50 transition"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-slate-500 text-sm">
                  {userPrompt.length} characters
                  {userPrompt.length > 0 && userPrompt.length < 50 && (
                    <span className="text-yellow-400 ml-2">
                      • Add more details for better results
                    </span>
                  )}
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!userPrompt.trim() || processing || !layoutId}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Dashboard
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Example Prompts */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="text-yellow-400" size={20} />
                Example Prompts for {selectedDomainData.name}
              </h3>
              <div className="space-y-2">
                {selectedDomainData.prompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptSelect(prompt)}
                    disabled={processing}
                    className="w-full text-left p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-blue-500 rounded-xl transition group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 group-hover:text-white flex-1">
                        {prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Processing Indicator */}
            {processing && (
              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="text-blue-400 animate-spin" size={28} />
                  <h3 className="text-blue-400 font-bold text-lg">
                    AI is analyzing your requirements...
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Understanding your prompt
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Analyzing factory layout and data sources
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Mapping requirements to available sensors
                  </p>
                  <p className="flex items-center gap-2 animate-pulse">
                    <Loader2 size={16} className="text-blue-400 animate-spin" />
                    Generating optimal dashboard configuration...
                  </p>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  This may take 10-30 seconds depending on complexity
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle
                  className="text-red-400 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1">
                  <h4 className="text-red-400 font-medium mb-1">
                    Generation Failed
                  </h4>
                  <p className="text-red-300 text-sm mb-3">{error}</p>
                  <button
                    onClick={handleRegenerate}
                    className="text-sm text-red-400 hover:text-red-300 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigureDashboard;
