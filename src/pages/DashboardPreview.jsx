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
  RefreshCw,
  Settings,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Responsive, WidthProvider } from "react-grid-layout";
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
} from "recharts";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import WorkflowEditor from "./WorkflowEditor";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  const [layouts, setLayouts] = useState({ lg: [] });

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
      const dash = response.data.dashboard;
      setDashboard(dash);
      setLiveData(response.data.liveData || {});
      setLastUpdate(new Date());

      if (dash.config?.widgets) {
        const generatedLayout = dash.config.widgets.map((w) => ({
          i: w._id,
          x: w.position?.x || 0,
          y: w.position?.y || 0,
          w: w.position?.w || 4,
          h: w.position?.h || 4,
          static: true, // Preview is not editable
        }));
        setLayouts({ lg: generatedLayout });
      }
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
    if (confirm("Are you sure?")) {
      navigate("/dashboard");
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
            onClick={() => navigate("/layouts")}
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
    <div className="min-h-full bg-slate-900 p-6 font-sans">
      {/* Header */}
      <div className="max-w-[1920px] mx-auto mb-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
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
                Cancel
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
        </div>
      </div>

      {/* Dashboard Grid using RGL for perfect layout consistency */}
      <div className="max-w-[1920px] mx-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          isDraggable={false}
          isResizable={false}
          margin={[24, 24]}
        >
          {dashboard.config?.widgets?.map((widget) => (
            <div
              key={widget._id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-sm"
            >
              <WidgetRenderer
                widget={widget}
                data={liveData[widget._id]}
                onOpenWorkflow={() => handleOpenWorkflow(widget)}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

// Enhanced Widget Renderer
const WidgetRenderer = ({ widget, data, onOpenWorkflow }) => {
  const renderContent = () => {
    if (data?.error || data?.meta?.error) {
      return (
        <ErrorWidget widget={widget} error={data?.error || data?.meta?.error} />
      );
    }

    if (!data) return <LoadingWidget />;

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
    <div className="h-full flex flex-col group">
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50">
        <h3 className="text-white font-semibold text-sm truncate pr-2">
          {widget.title}
        </h3>
        {widget.hasWorkflow && (
          <button
            onClick={onOpenWorkflow}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white"
            title="Edit Workflow"
          >
            <Settings size={14} />
          </button>
        )}
      </div>
      <div className="p-4 flex-1 min-h-0 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

// --- Widget Implementations ---

const LoadingWidget = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <Loader2 className="animate-spin text-slate-600" size={24} />
  </div>
);

const LineChartWidget = ({ widget, data }) => {
  if (!data || (!data.history && !data.series)) {
    return <EmptyDataWidget message="No data available" />;
  }

  let chartData = [];
  let seriesKeys = [];

  if (data.type === "timeSeries") {
    chartData = data.history.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: item.value,
    }));
    seriesKeys = ["value"];
  } else if (data.type === "multiSeries") {
    const timestamps = new Set();
    Object.values(data.series || {}).forEach((arr) =>
      arr.forEach((item) => timestamps.add(item.timestamp))
    );
    chartData = Array.from(timestamps).sort().map((ts) => {
      const point = { time: new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      Object.entries(data.series).forEach(([key, arr]) => {
        const item = arr.find((i) => i.timestamp === ts);
        point[key] = item ? item.value : null;
      });
      return point;
    });
    seriesKeys = Object.keys(data.series || {});
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", color: "#f1f5f9" }}
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
  );
};

const AreaChartWidget = ({ widget, data }) => {
  if (!data || (!data.history && !data.series)) return <EmptyDataWidget />;

  let chartData = [];
  // Standardize data
  if (data.type === "timeSeries") {
    chartData = data.history.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: item.value,
    }));
  } else {
     // rudimentary fallback for simple array
     chartData = (data.history || []).map((item) => ({
       time: new Date(item.timestamp).toLocaleTimeString(),
       value: item.value
     }));
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569" }} />
        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const BarChartWidget = ({ widget, data }) => {
  if (!data.history) return <EmptyDataWidget message="No data" />;

  const chartData = data.history.slice(-15).map((item) => ({
    time: item.timestamp.includes('T') ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit' }) : item.timestamp,
    value: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569" }} />
        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const GaugeWidget = ({ widget, data }) => {
  const value = data.current || data.value || 0;
  const min = widget.settings?.min || 0;
  const max = widget.settings?.max || 100;
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#334155" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.51} 251`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{formatValue(value)}</span>
          {data.unit && <span className="text-slate-400 text-xs mt-1">{data.unit}</span>}
        </div>
      </div>
    </div>
  );
};

const StatCardWidget = ({ widget, data }) => {
  const value = data.current || data.value || 0;
  const trend = data.trend; // Optional trend

  return (
    <div className="h-full flex flex-col justify-center px-2">
      <div className="flex items-end gap-2 mb-2">
        <span className="text-4xl font-bold text-white tracking-tight">{formatValue(value)}</span>
        {data.unit && <span className="text-slate-400 text-sm mb-1.5 font-medium">{data.unit}</span>}
      </div>
      {trend !== undefined && (
         <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}% vs last hr</span>
         </div>
      )}
    </div>
  );
};

const TableWidget = ({ widget, data }) => {
  if (!data.rows || data.rows.length === 0) return <EmptyDataWidget />;

  return (
    <div className="h-full overflow-auto custom-scrollbar">
      <table className="w-full text-xs text-left">
        <thead className="bg-slate-700/50 sticky top-0 z-10 backdrop-blur-sm">
          <tr>
            {data.columns.map((col) => (
              <th key={col} className="px-4 py-2 text-slate-300 font-medium whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, idx) => (
            <tr key={row.id || idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
              {data.columns.map((col) => (
                <td key={col} className="px-4 py-2.5 text-slate-200 whitespace-nowrap">
                  {col.toLowerCase().includes('tim') 
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

const AlertListWidget = ({ widget, data }) => {
  // Support both 'alerts' and 'items' keys based on backend response
  const alerts = data.alerts || data.items || [];

  if (alerts.length === 0) return <EmptyDataWidget message="No active alerts" />;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar space-y-2 pr-1">
      {alerts.map((alert, idx) => (
        <div
          key={alert.id || idx}
          className={`p-3 rounded-lg border flex gap-3 ${
            (alert.severity === 'critical' || alert.level === 'critical')
              ? 'bg-red-500/10 border-red-500/20 text-red-200'
              : (alert.severity === 'warning' || alert.level === 'warning')
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
              : 'bg-blue-500/10 border-blue-500/20 text-blue-200'
          }`}
        >
          <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
             (alert.severity === 'critical' || alert.level === 'critical') ? 'bg-red-500' : 
             (alert.severity === 'warning' || alert.level === 'warning') ? 'bg-amber-500' : 'bg-blue-500'
          }`} />
          <div className="flex-1 min-w-0">
             <div className="flex justify-between items-start">
               <h4 className="font-semibold text-xs leading-snug">{alert.title || alert.message}</h4>
               {alert.timestamp && (
                  <span className="text-[10px] opacity-70 whitespace-nowrap ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
               )}
             </div>
             {alert.description && <p className="text-[11px] opacity-80 mt-1 leading-relaxed">{alert.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyDataWidget = ({ message = "No data" }) => (
  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
    <BarChart3 className="text-slate-400 mb-2" size={24} />
    <p className="text-slate-400 text-xs">{message}</p>
  </div>
);

const ErrorWidget = ({ widget, error }) => (
  <div className="h-full flex flex-col items-center justify-center text-center p-4">
    <AlertCircle className="text-red-400 mb-2" size={24} />
    <p className="text-red-400 text-xs">{error}</p>
  </div>
);

const GenericWidget = ({ widget, data }) => (
  <div className="h-full overflow-auto custom-scrollbar p-2">
    <pre className="text-[10px] text-slate-400 whitespace-pre-wrap">
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
);

function formatValue(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") {
    // Show 2 decimals if not integer
    return Number.isInteger(value) ? value : value.toFixed(2);
  }
  return String(value);
}

export default DashboardPreview;
