import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  GitCompare,
  Layout,
  Check,
} from "lucide-react";
import toast from "react-hot-toast";

const TEMPLATES = [
  {
    id: "real-time-monitoring",
    name: "Real-time Monitoring",
    description: "Live data displays with current values and status indicators",
    icon: Activity,
    color: "blue",
    features: [
      "Live data widgets",
      "Status indicators",
      "Current values",
      "Auto-refresh",
    ],
    widgets: ["stat-cards", "live-charts", "gauges", "status-badges"],
    preview: "Real-time data visualization with live updates every 5 seconds",
  },
  {
    id: "historical-analysis",
    name: "Historical Analysis",
    description: "Analyze trends and patterns over time with advanced charts",
    icon: TrendingUp,
    color: "purple",
    features: [
      "Time-series charts",
      "Trend analysis",
      "Data comparison",
      "Date filters",
    ],
    widgets: ["line-charts", "area-charts", "comparison-charts", "date-picker"],
    preview: "Historical data analysis with customizable time ranges",
  },
  {
    id: "performance-dashboard",
    name: "Performance Dashboard",
    description: "Track KPIs and performance metrics with target indicators",
    icon: BarChart3,
    color: "green",
    features: [
      "KPI cards",
      "Target vs Actual",
      "Performance bars",
      "Summary stats",
    ],
    widgets: ["kpi-cards", "progress-bars", "donut-charts", "summary-tables"],
    preview: "Performance tracking with goals and achievements",
  },
  {
    id: "alert-dashboard",
    name: "Alert Dashboard",
    description: "Monitor critical alerts and system warnings in real-time",
    icon: AlertTriangle,
    color: "red",
    features: [
      "Alert feed",
      "Severity levels",
      "Acknowledgment",
      "Alert history",
    ],
    widgets: [
      "alert-list",
      "severity-badges",
      "alert-timeline",
      "notification-panel",
    ],
    preview: "Real-time alert monitoring with severity classification",
  },
  {
    id: "comparison-dashboard",
    name: "Comparison Dashboard",
    description: "Side-by-side comparison of multiple data sources",
    icon: GitCompare,
    color: "orange",
    features: [
      "Side-by-side views",
      "Comparative charts",
      "Difference indicators",
      "Multi-select",
    ],
    widgets: [
      "comparison-charts",
      "diff-tables",
      "dual-gauges",
      "variance-cards",
    ],
    preview: "Compare multiple sources and identify differences",
  },
  {
    id: "custom-dashboard",
    name: "Custom Dashboard",
    description: "Start from scratch with AI assistance",
    icon: Layout,
    color: "cyan",
    features: [
      "Flexible layout",
      "Custom widgets",
      "AI-powered",
      "Full control",
    ],
    widgets: ["any-widget-type"],
    preview: "Build your own dashboard with AI guidance",
  },
];

const ChooseTemplate = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleContinue = () => {
    if (!selectedTemplate) {
      toast.error("Please select a template");
      return;
    }

    // Save selected template
    const builderState = JSON.parse(
      localStorage.getItem("dashboardBuilderState") || "{}"
    );
    builderState.template = selectedTemplate;
    localStorage.setItem("dashboardBuilderState", JSON.stringify(builderState));

    navigate("/dashboard-builder/configure");
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Choose Dashboard Template
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard-builder/factory-layout")}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedTemplate}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isSelected = selectedTemplate === template.id;

            return (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`text-left bg-slate-800 rounded-xl p-6 border-2 transition-all hover:scale-[1.02] ${
                  isSelected
                    ? `border-${template.color}-500 ring-2 ring-${template.color}-500/20`
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                {/* Icon & Selected Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 bg-${template.color}-500/10 rounded-xl flex items-center justify-center`}
                  >
                    <Icon className={`text-${template.color}-400`} size={28} />
                  </div>
                  {isSelected && (
                    <div
                      className={`bg-${template.color}-500 text-white rounded-full p-1`}
                    >
                      <Check size={16} />
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  {template.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${template.color}-400`}
                      ></div>
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Preview Text */}
                <div
                  className={`p-3 bg-${template.color}-500/5 border border-${template.color}-500/20 rounded-lg`}
                >
                  <p className={`text-${template.color}-400 text-xs`}>
                    {template.preview}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-slate-800 rounded-xl border border-slate-700">
          <h3 className="text-white font-semibold mb-2">Need help choosing?</h3>
          <p className="text-slate-400 text-sm mb-4">
            Don't worry! You can customize everything in the next step using AI.
            The template just gives you a starting point.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="text-blue-400 mt-1">•</div>
              <div>
                <span className="text-white font-medium">Real-time:</span>
                <span className="text-slate-400">
                  {" "}
                  Best for monitoring current status
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="text-purple-400 mt-1">•</div>
              <div>
                <span className="text-white font-medium">Historical:</span>
                <span className="text-slate-400"> Best for trend analysis</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="text-green-400 mt-1">•</div>
              <div>
                <span className="text-white font-medium">Performance:</span>
                <span className="text-slate-400"> Best for tracking KPIs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseTemplate;
