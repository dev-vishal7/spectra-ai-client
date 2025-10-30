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

// 🎯 Domain Categories
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
    id: "process",
    name: "Process Control",
    icon: Activity,
    color: "purple",
    gradient: "from-purple-500 to-pink-500",
    prompts: [
      "Monitor all critical process parameters in real-time",
      "Display pressure and temperature with safety limits",
      "Track batch processing with quality metrics",
    ],
  },
  {
    id: "warehouse",
    name: "Warehouse & Logistics",
    icon: Package,
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    prompts: [
      "Track inventory levels with low-stock alerts",
      "Monitor warehouse temperature and humidity zones",
      "Display shipping metrics with delivery timelines",
    ],
  },
  {
    id: "fleet",
    name: "Fleet Management",
    icon: Truck,
    color: "green",
    gradient: "from-green-500 to-emerald-500",
    prompts: [
      "Track vehicle locations with route optimization",
      "Monitor fuel consumption and maintenance schedules",
      "Display delivery status with real-time updates",
    ],
  },
  {
    id: "building",
    name: "Building Management",
    icon: Building2,
    color: "indigo",
    gradient: "from-indigo-500 to-purple-500",
    prompts: [
      "Monitor occupancy levels across all floors",
      "Track energy usage per zone with cost analysis",
      "Display security alerts with access control",
    ],
  },
  {
    id: "retail",
    name: "Retail & Commerce",
    icon: ShoppingCart,
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
    prompts: [
      "Track sales performance across all locations",
      "Monitor foot traffic with conversion rates",
      "Display inventory turnover with reorder alerts",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare Facilities",
    icon: Heart,
    color: "red",
    gradient: "from-red-500 to-pink-500",
    prompts: [
      "Monitor critical equipment status with alerts",
      "Track environmental conditions in sterile zones",
      "Display patient flow with bed occupancy",
    ],
  },
  {
    id: "office",
    name: "Office & Workspace",
    icon: Briefcase,
    color: "slate",
    gradient: "from-slate-500 to-gray-500",
    prompts: [
      "Monitor workspace utilization with booking trends",
      "Track energy consumption per department",
      "Display meeting room availability with schedules",
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
  const [userPrompt, setUserPrompt] = useState("");
  const [processing, setProcessing] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [error, setError] = useState(null);
  const [layoutId, setLayoutId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate getting layout ID from builder state
    const builderState = {
      layoutId: "layout_123",
      factoryName: "Demo Factory",
    };
    setLayoutId(builderState.layoutId);
  }, []);

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
    setUserPrompt("");
    setGeneratedConfig(null);
    setError(null);
  };

  const handlePromptSelect = (prompt) => {
    setUserPrompt(prompt);
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      alert("Please describe what you want to see in your dashboard");
      return;
    }

    if (!layoutId) {
      alert("Layout not found. Please start from factory setup.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated dashboard
      const mockDashboard = {
        name: "AI Generated Dashboard",
        description: "Dashboard based on your requirements",
        widgets: [
          {
            title: "Temperature Monitor",
            type: "line-chart",
            dataSource: "Motor Sensors",
          },
          {
            title: "Current Status",
            type: "stat-card",
            dataSource: "Live Feed",
          },
          {
            title: "Alert Feed",
            type: "alert-list",
            dataSource: "Alert System",
          },
          {
            title: "Performance Gauge",
            type: "gauge",
            dataSource: "Performance Metrics",
          },
        ],
        refreshInterval: 5000,
      };

      setGeneratedConfig(mockDashboard);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate dashboard configuration");
    } finally {
      setProcessing(false);
    }
  };

  const handlePreview = () => {
    if (!generatedConfig) return;
    alert("Dashboard preview would open here!");
  };

  const handleRegenerate = () => {
    setGeneratedConfig(null);
    setError(null);
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
          </div>
          <button
            onClick={() => navigate("/dashboard-builder/choose-template")}
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition border border-slate-600"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Progress */}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Domain Selection */}
        {!selectedDomain && !generatedConfig && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Choose Your Domain
              </h2>
              <p className="text-slate-400">
                Select the domain that best matches your use case
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
        {selectedDomain && !generatedConfig && (
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
                      AI-powered dashboard generation
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
                ranges, alerts, and visualizations.
              </p>

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Example: Show me temperature trends for all motors in the last 24 hours with alerts when temperature exceeds 80 degrees. Include gauges for current values and a line chart for historical data..."
                rows={6}
                disabled={processing}
                className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 disabled:opacity-50 transition"
              />

              <div className="flex items-center justify-between mt-4">
                <span className="text-slate-500 text-sm">
                  {userPrompt.length} characters
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!userPrompt.trim() || processing}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-medium transition shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {processing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Generating Magic...
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
                    <p className="text-slate-300 group-hover:text-white">
                      {prompt}
                    </p>
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
                    AI is working its magic...
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Analyzing your requirements
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Identifying data sources from layout
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-400" />
                    Selecting appropriate widgets
                  </p>
                  <p className="flex items-center gap-2 animate-pulse">
                    <Loader2 size={16} className="text-blue-400 animate-spin" />
                    Generating dashboard layout...
                  </p>
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
                <div>
                  <h4 className="text-red-400 font-medium mb-1">
                    Generation Failed
                  </h4>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generated Config Display */}
        {generatedConfig && !processing && (
          <div className="space-y-6">
            {/* Success Message */}
            <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-400" size={28} />
                <h3 className="text-green-400 font-bold text-xl">
                  Dashboard Generated Successfully!
                </h3>
              </div>
              <p className="text-slate-300">
                Your dashboard is ready. Review the configuration below and
                preview it.
              </p>
            </div>

            {/* Dashboard Config */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4 text-lg">
                Dashboard Configuration
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-slate-400 text-sm">
                    Dashboard Name
                  </label>
                  <p className="text-white font-medium text-lg">
                    {generatedConfig.name}
                  </p>
                </div>

                {/* Description */}
                {generatedConfig.description && (
                  <div>
                    <label className="text-slate-400 text-sm">
                      Description
                    </label>
                    <p className="text-slate-300">
                      {generatedConfig.description}
                    </p>
                  </div>
                )}

                {/* Widgets */}
                <div>
                  <label className="text-slate-400 text-sm mb-3 block">
                    Widgets ({generatedConfig.widgets?.length || 0})
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedConfig.widgets?.map((widget, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">
                            {widget.title}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                            {widget.type}
                          </span>
                        </div>
                        {widget.dataSource && (
                          <p className="text-slate-400 text-xs">
                            Source: {widget.dataSource}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Refresh Rate */}
                {generatedConfig.refreshInterval && (
                  <div>
                    <label className="text-slate-400 text-sm">
                      Refresh Interval
                    </label>
                    <p className="text-white font-medium">
                      {generatedConfig.refreshInterval / 1000} seconds
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* User Prompt */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h4 className="text-slate-400 text-sm mb-2">Your Request</h4>
              <p className="text-slate-300">{userPrompt}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRegenerate}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition border border-slate-600"
              >
                Regenerate
              </button>
              <button
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-lg hover:shadow-xl"
              >
                <Eye size={20} />
                Preview Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigureDashboard;
