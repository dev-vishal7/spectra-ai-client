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
  AlertTriangle,
  CheckCircle,
  Info,
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

const DashboardPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

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
              key={widget.id}
              widget={widget}
              data={liveData[widget.id]}
              position={widget.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ WIDGET RENDERER ============

const WidgetRenderer = ({ widget, data, position }) => {
  const { x = 0, y = 0, w = 6, h = 3 } = position || {};
  const colSpan = Math.min(w, 12);

  if (!data) {
    return (
      <div
        className={`col-span-${colSpan} bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-center`}
        style={{
          gridColumnStart: x + 1, // CSS grid index is 1-based
          gridColumnEnd: `span ${w}`,
          gridRowStart: y + 1,
          gridRowEnd: `span ${h}`,
          minHeight: `${h * 100}px`, // optional — better visual scaling
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
          gridColumnStart: x + 1, // CSS grid index is 1-based
          gridColumnEnd: `span ${w}`,
          gridRowStart: y + 1,
          gridRowEnd: `span ${h}`,
          minHeight: `${h * 100}px`, // optional — better visual scaling
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
      className={`col-span-${colSpan} bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all relative`}
      style={{
        gridColumnStart: x + 1, // CSS grid index is 1-based
        gridColumnEnd: `span ${w}`,
        gridRowStart: y + 1,
        gridRowEnd: `span ${h}`,
        minHeight: `${h * 100}px`, // optional — better visual scaling
      }}
    >
      {renderContent()}
      {data.meta && <DataQualityBadge quality={data.meta.dataQuality} />}
    </div>
  );
};

// ============ WIDGET COMPONENTS ============

// 🔥 Line Chart (handles both single and multi-series)
const LineChartWidget = ({ widget, data }) => {
  // Multi-series data
  if (data.type === "multiSeries" && data.series) {
    return <MultiSeriesLineChart widget={widget} data={data} />;
  }

  // Single series data
  if (!data.history || data.history.length === 0) {
    return <EmptyDataWidget widget={widget} />;
  }

  const chartData = data.history.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{widget.title}</h3>
        {data.current !== null && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-400">
              {formatValue(data.current)}
            </span>
            {widget.settings?.unit && (
              <span className="text-slate-400 text-sm">
                {widget.settings.unit}
              </span>
            )}
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={300}>
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
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors[0]}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>

      {data.stats && (
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
          <span>Min: {formatValue(data.stats.min)}</span>
          <span>Max: {formatValue(data.stats.max)}</span>
          <span>Avg: {formatValue(data.stats.avg)}</span>
          <TrendBadge trend={data.stats.trend} />
        </div>
      )}
    </div>
  );
};

// 🔥 Multi-Series Line Chart (for comparing multiple fields)
const MultiSeriesLineChart = ({ widget, data }) => {
  const { series, fields } = data;

  // Combine all series into single chart data
  const timestamps = series[fields[0]]?.map((item) => item.timestamp) || [];
  const chartData = timestamps.map((timestamp, idx) => {
    const point = { time: new Date(timestamp).toLocaleTimeString() };
    fields.forEach((field) => {
      point[field] = series[field]?.[idx]?.value;
    });
    return point;
  });

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4">{widget.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
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
          <Legend />
          {fields.map((field, idx) => (
            <Line
              key={field}
              type="monotone"
              dataKey={field}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={false}
              name={field}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart
const AreaChartWidget = ({ widget, data }) => {
  if (!data.history || data.history.length === 0) {
    return <EmptyDataWidget widget={widget} />;
  }

  const chartData = data.history.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4">{widget.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
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
          <Area
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar Chart
const BarChartWidget = ({ widget, data }) => {
  if (!data.history || data.history.length === 0) {
    return <EmptyDataWidget widget={widget} />;
  }

  const chartData = data.history.slice(-15).map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4">{widget.title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
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
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Gauge Widget
const GaugeWidget = ({ widget, data }) => {
  const value = data.current || 0;
  const min = widget.settings?.min || 0;
  const max = widget.settings?.max || 100;
  const percentage = Math.min(
    100,
    Math.max(0, ((value - min) / (max - min)) * 100)
  );

  const color = getThresholdColor(value, widget.settings?.thresholds);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h3 className="text-white font-semibold mb-4">{widget.title}</h3>
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
            stroke={color}
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
      <div className="mt-4 flex items-center gap-4 text-slate-400 text-sm">
        <span>{formatValue(min)}</span>
        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
        <span>{formatValue(max)}</span>
      </div>
      {data.trend && <TrendIndicator trend={data.trend} />}
    </div>
  );
};

// Stat Card Widget
const StatCardWidget = ({ widget, data }) => {
  const value = data.current || 0;

  return (
    <div className="h-full flex flex-col justify-between p-2">
      <h3 className="text-slate-400 text-sm font-medium">{widget.title}</h3>
      <div>
        <div className="text-5xl font-bold text-white mb-2 transition-all duration-300">
          {formatValue(value)}
        </div>
        {data.unit && (
          <span className="text-slate-400 text-sm">{data.unit}</span>
        )}
      </div>
      {data.trend && (
        <div className="flex items-center justify-between">
          <TrendIndicator trend={data.trend} showPercentage />
          <div className="flex items-center gap-1 text-green-400 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Alert List Widget
const AlertListWidget = ({ widget, data }) => {
  const alerts = data.items || [];
  const summary = data.summary || { critical: 0, warning: 0, info: 0 };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{widget.title}</h3>
        <div className="flex items-center gap-2 text-xs">
          {summary.critical > 0 && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
              {summary.critical} Critical
            </span>
          )}
          {summary.warning > 0 && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              {summary.warning} Warning
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <CheckCircle className="mx-auto mb-2" size={32} />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  );
};

// 🔥 Table Widget (Multi-Field)
const TableWidget = ({ widget, data }) => {
  if (!data.rows || data.rows.length === 0) {
    return <EmptyDataWidget widget={widget} />;
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-white font-semibold mb-4">{widget.title}</h3>
      <div className="overflow-auto flex-1">
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
    </div>
  );
};

// ============ UTILITY COMPONENTS ============

const AlertItem = ({ alert }) => {
  const icons = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  };
  const Icon = icons[alert.level] || AlertCircle;

  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        alert.level === "critical"
          ? "bg-red-500/10 border-red-500/50"
          : alert.level === "warning"
          ? "bg-yellow-500/10 border-yellow-500/50"
          : "bg-blue-500/10 border-blue-500/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={
            alert.level === "critical"
              ? "text-red-400"
              : alert.level === "warning"
              ? "text-yellow-400"
              : "text-blue-400"
          }
          size={18}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span
              className={`text-xs font-bold uppercase ${
                alert.level === "critical"
                  ? "text-red-400"
                  : alert.level === "warning"
                  ? "text-yellow-400"
                  : "text-blue-400"
              }`}
            >
              {alert.level}
            </span>
            <span className="text-xs text-slate-500">
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-slate-200 text-sm">{alert.message}</p>
        </div>
      </div>
    </div>
  );
};

const TrendIndicator = ({ trend, showPercentage = false }) => {
  const icons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus,
  };
  const colors = {
    up: "text-green-400",
    down: "text-red-400",
    stable: "text-slate-400",
  };

  const Icon = icons[trend.direction] || Minus;

  return (
    <div
      className={`flex items-center gap-1 text-sm ${colors[trend.direction]}`}
    >
      <Icon size={16} />
      {showPercentage && <span>{Math.abs(trend.percentage)}%</span>}
    </div>
  );
};

const TrendBadge = ({ trend }) => {
  const labels = {
    up: "Increasing",
    down: "Decreasing",
    stable: "Stable",
  };
  return <span>Trend: {labels[trend] || "Unknown"}</span>;
};

const DataQualityBadge = ({ quality }) => {
  if (!quality || quality === "good") return null;

  const colors = {
    degraded: "bg-yellow-500/20 text-yellow-400",
    poor: "bg-red-500/20 text-red-400",
  };

  return (
    <div
      className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${colors[quality]}`}
    >
      {quality}
    </div>
  );
};

const EmptyDataWidget = ({ widget }) => (
  <div className="h-full flex flex-col items-center justify-center text-center">
    <BarChart3 className="text-slate-600 mb-3" size={32} />
    <h3 className="text-white font-semibold mb-1">{widget.title}</h3>
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
    <h3 className="text-white font-semibold mb-4">{widget.title}</h3>
    <pre className="text-xs text-slate-400 overflow-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

// ============ UTILITY FUNCTIONS ============

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

function getThresholdColor(value, thresholds) {
  if (!thresholds || thresholds.length === 0) return "#3b82f6";

  for (const threshold of thresholds) {
    if (value >= threshold.value) {
      return threshold.color === "red"
        ? "#ef4444"
        : threshold.color === "yellow"
        ? "#eab308"
        : "#3b82f6";
    }
  }

  return "#3b82f6";
}

export default DashboardPreview;
