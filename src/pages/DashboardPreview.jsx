import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  AlertCircle,
  Sparkles,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Settings,
  GitBranch,
  Edit,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import WorkflowEditor from "./WorkflowEditor";

const DashboardPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [workflowEditorOpen, setWorkflowEditorOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [id]);

  useEffect(() => {
    if (!autoRefresh || !dashboard) return;

    const interval = setInterval(() => {
      loadLiveData();
    }, dashboard.config?.refreshInterval || 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, dashboard]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/dashboard/preview/${id}`);
      setDashboard(response.data.dashboard);
      setLiveData(response.data.liveData || {});
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadLiveData = async () => {
    try {
      const response = await axios.get(`/dashboard/preview/${id}`);
      setLiveData(response.data.liveData || {});
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const handlePublish = async () => {
    if (!confirm("Publish this dashboard? It will be visible to all users.")) {
      return;
    }

    try {
      setPublishing(true);
      await axios.post(`/dashboard/${id}/publish`);
      toast.success("Dashboard published successfully!");
      navigate(`/dashboard/view/${id}`);
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish dashboard");
    } finally {
      setPublishing(false);
    }
  };

  const handleRegenerate = () => {
    if (confirm("Go back and regenerate this dashboard?")) {
      navigate("/builder/configure");
    }
  };

  const handleOpenWorkflow = (widget) => {
    setSelectedWidget(widget);
    setWorkflowEditorOpen(true);
  };

  const handleCloseWorkflow = () => {
    setWorkflowEditorOpen(false);
    setSelectedWidget(null);
    loadDashboard();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-blue-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-white text-lg">Loading dashboard preview...</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <p className="text-white text-lg mb-4">Dashboard not found</p>
          <button
            onClick={() => navigate("/builder/factory-layout")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  if (workflowEditorOpen && selectedWidget) {
    return (
      <WorkflowEditor
        widgetId={selectedWidget._id}
        dashboardId={id}
        workflowId={selectedWidget.workflowId}
        onClose={handleCloseWorkflow}
        onSave={handleCloseWorkflow}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto mb-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/builder/configure")}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                <ArrowLeft className="text-white" size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {dashboard.name}
                  </h1>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium flex items-center gap-1">
                    <Eye size={14} />
                    Preview Mode
                  </span>
                </div>
                <p className="text-slate-400">{dashboard.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                  autoRefresh
                    ? "bg-green-500/20 border-green-500/50 text-green-400"
                    : "bg-slate-700 border-slate-600 text-slate-400"
                }`}
              >
                <RefreshCw
                  size={16}
                  className={autoRefresh ? "animate-spin" : ""}
                />
                <span className="text-sm font-medium">
                  {autoRefresh ? "Live" : "Paused"}
                </span>
              </button>

              <button
                onClick={handleRegenerate}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition"
              >
                Regenerate
              </button>

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-lg"
              >
                {publishing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Publish Dashboard
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles size={14} className="text-purple-400" />
                <span>AI Generated</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <BarChart3 size={14} />
                <span>{dashboard.config?.widgets?.length || 0} Widgets</span>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <RefreshCw size={14} />
                <span>
                  Every {(dashboard.config?.refreshInterval || 5000) / 1000}s
                </span>
              </div>
            </div>
            <div className="text-slate-500 text-xs">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {dashboard.config?.widgets?.map((widget) => (
            <WidgetRenderer
              key={widget._id}
              widget={widget}
              data={liveData[widget._id]}
              position={widget.position}
              onOpenWorkflow={() => handleOpenWorkflow(widget)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Widget Renderer with Workflow Support
const WidgetRenderer = ({ widget, data, position, onOpenWorkflow }) => {
  const { x = 0, y = 0, w = 6, h = 3 } = position || {};
  const colSpan = Math.min(w, 12);
  if (!data) {
    return (
      <div
        className={`col-span-${colSpan} bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-center`}
        style={{
          gridColumnStart: x + 1,
          gridColumnEnd: `span ${w}`,
          gridRowStart: y + 1,
          gridRowEnd: `span ${h}`,
          minHeight: `${h * 100}px`,
        }}
      >
        <Loader2 className="animate-spin text-slate-600" size={32} />
      </div>
    );
  }

  if (data.error || data.meta?.error) {
    return (
      <div
        className={`col-span-${colSpan} bg-slate-800 rounded-xl p-6 border border-red-500/30`}
        style={{
          gridColumnStart: x + 1,
          gridColumnEnd: `span ${w}`,
          gridRowStart: y + 1,
          gridRowEnd: `span ${h}`,
          minHeight: `${h * 100}px`,
        }}
      >
        <ErrorWidget widget={widget} error={data.error || data.meta.error} />
      </div>
    );
  }

  const renderContent = () => {
    switch (widget.type) {
      case "line-chart":
        return <LineChartWidget widget={widget} data={data} />;
      case "area-chart":
        return <AreaChartWidget widget={widget} data={data} />;
      case "bar-chart":
        return <BarChartWidget widget={widget} data={data} />;
      case "gauge":
        return <GaugeWidget widget={widget} data={data} />;
      case "stat-card":
        return <StatCardWidget widget={widget} data={data} />;
      case "alert-list":
        return <AlertListWidget widget={widget} data={data} />;
      case "table":
        return <TableWidget widget={widget} data={data} />;
      default:
        return <GenericWidget widget={widget} data={data} />;
    }
  };

  return (
    <div
      className={`col-span-${colSpan} bg-slate-800 rounded-xl border border-slate-700 hover:border-slate-600 transition-all relative group`}
      style={{
        gridColumnStart: x + 1,
        gridColumnEnd: `span ${w}`,
        gridRowStart: y + 1,
        gridRowEnd: `span ${h}`,
        minHeight: `${h * 100}px`,
      }}
    >
      {/* Widget Header with Workflow Indicator */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold text-sm">{widget.title}</h3>
        </div>
        {widget.hasWorkflow && (
          <button
            onClick={onOpenWorkflow}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg"
            title="Edit Workflow"
          >
            <Settings size={16} className="text-white" />
          </button>
        )}
      </div>

      <div className="p-4">{renderContent()}</div>
    </div>
  );
};

// Widget Components (same as before but included for completeness)
const LineChartWidget = ({ widget, data }) => {
  if (!data || (!data.history && !data.series)) {
    return <div>No data available</div>;
  }

  let chartData = [];
  let seriesKeys = [];

  if (data.type === "timeSeries") {
    chartData = data.history.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      value: item.value,
    }));
    seriesKeys = ["value"];
  } else if (data.type === "multiSeries") {
    // Collect all timestamps
    const timestamps = new Set();
    Object.values(data.series).forEach((arr) =>
      arr.forEach((item) => timestamps.add(new Date(item.timestamp).getTime()))
    );
    const sortedTimestamps = Array.from(timestamps).sort((a, b) => a - b);

    // Build chartData array with all series
    chartData = sortedTimestamps.map((ts) => {
      const point = { time: new Date(ts).toLocaleTimeString() };
      Object.entries(data.series).forEach(([key, arr]) => {
        const item = arr.find((i) => new Date(i.timestamp).getTime() === ts);
        point[key] = item ? item.value : null;
      });
      return point;
    });

    seriesKeys = Object.keys(data.series);
  }

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
          />
          {seriesKeys.map((key, idx) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={["#3b82f6", "#f97316", "#22c55e", "#e11d48"][idx % 4]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const GaugeWidget = ({ widget, data }) => {
  const value = data.current || data.value || 0;
  const min = widget.settings?.min || 0;
  const max = widget.settings?.max || 100;
  const percentage = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100)
  );

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#334155"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {formatValue(value)}
          </span>
          {data.unit && (
            <span className="text-slate-400 text-sm">{data.unit}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCardWidget = ({ widget, data }) => {
  const value = data.current || data.value || 0;

  return (
    <div className="h-full flex flex-col justify-between p-2">
      <div>
        <div className="text-5xl font-bold text-white mb-2 transition-all duration-300">
          {formatValue(value)}
        </div>
        {data.unit && (
          <span className="text-slate-400 text-sm">{data.unit}</span>
        )}
      </div>
    </div>
  );
};

const TableWidget = ({ widget, data }) => {
  if (!data.rows || data.rows.length === 0) {
    return <EmptyDataWidget widget={widget} />;
  }

  return (
    <div className="h-full flex flex-col overflow-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-700 sticky top-0">
          <tr>
            {data.columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left text-slate-300 font-medium"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, idx) => (
            <tr
              key={row.id || idx}
              className="border-b border-slate-700 hover:bg-slate-700/30"
            >
              {data.columns.map((col) => (
                <td key={col} className="px-4 py-2 text-slate-300">
                  {col === "timestamp"
                    ? new Date(row[col]).toLocaleString()
                    : formatValue(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EmptyDataWidget = ({ widget }) => (
  <div className="h-full flex flex-col items-center justify-center text-center">
    <BarChart3 className="text-slate-600 mb-3" size={32} />
    <p className="text-slate-500 text-sm">No data available</p>
  </div>
);

const ErrorWidget = ({ widget, error }) => (
  <div className="h-full flex flex-col items-center justify-center text-center">
    <AlertCircle className="text-red-400 mb-3" size={32} />
    <h3 className="text-white font-semibold mb-1">{widget.title}</h3>
    <p className="text-red-400 text-sm">{error}</p>
  </div>
);

const GenericWidget = ({ widget, data }) => (
  <div className="h-full flex flex-col">
    <pre className="text-xs text-slate-400 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

function formatValue(value) {
  if (value === null || value === undefined) return "N/A";
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return String(value);
}

export default DashboardPreview;
