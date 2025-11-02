import { useState, useEffect } from "react";
import {
  Plus,
  BarChart3,
  Database,
  Eye,
  AlertTriangle,
  MessageSquare,
  X,
  Send,
  ArrowLeft,
  Download,
  Share2,
  Edit,
  Trash2,
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  WifiOff,
  Activity,
  Zap,
  CheckCircle,
  GripVertical,
  Loader2,
} from "lucide-react";
import { Responsive, WidthProvider } from "react-grid-layout";
import {
  LineChart,
  Line,
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
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResponsiveGridLayout = WidthProvider(Responsive);

// ============ MAIN DASHBOARD COMPONENT ============
export default function Dashboard() {
  const [dashboards, setDashboards] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [stats, setStats] = useState({
    totalDashboards: 0,
    dataSources: 0,
    totalViews: 0,
    activeAlerts: 0,
  });

  useEffect(() => {
    loadDashboards();
    loadOverviewData();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/dashboard/list");

      if (response.data) {
        const dashboardList = response.data.dashboards || [];
        setDashboards(dashboardList);
        setStats((prev) => ({
          ...prev,
          totalDashboards: dashboardList.length,
          totalViews: dashboardList.reduce(
            (sum, d) => sum + (d.viewCount || 0),
            0
          ),
        }));
      }
    } catch (error) {
      console.error("Load dashboards error:", error);
      toast.error("Failed to load dashboards");
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewData = async () => {
    try {
      // Load sources
      const sourcesResponse = await axios.get("/sources/get-sources");

      if (sourcesResponse.data) {
        const sources = sourcesResponse.data || [];

        setStats((prev) => ({
          ...prev,
          dataSources: sources.length,
        }));
        // Get first 6 sources for table
        const recentSources = sources.slice(0, 6);
        const tableData = recentSources.map((source) => ({
          source: source.name,
          protocol: source.protocol,
          value: "Loading...",
          status: source.status || "connected",
          lastUpdate: source.lastConnected
            ? new Date(source.lastConnected).toLocaleString()
            : "N/A",
          sourceId: source._id,
        }));

        setSensorData(tableData);

        // Load latest data for each source
        recentSources.forEach(async (source) => {
          try {
            const dataResponse = await axios.get(
              `/sources/latest-data/${source._id}`
            );

            if (dataResponse.data.success && dataResponse.data.data) {
              const sourceData = dataResponse.data.data;
              const parsed = sourceData.data?.parsed?.value || {};

              // Get first available field value
              const fields = Object.keys(parsed);
              const firstValue = fields.length > 0 ? parsed[fields[0]] : "N/A";

              setSensorData((prev) =>
                prev.map((s) =>
                  s.sourceId === source._id
                    ? {
                        ...s,
                        value: `${firstValue} ${
                          fields.length > 1
                            ? `(+${fields.length - 1} more)`
                            : ""
                        }`,
                        lastUpdate: new Date(
                          sourceData.timestamp
                        ).toLocaleString(),
                      }
                    : s
                )
              );
            }
          } catch (err) {
            console.error(`Error loading data for ${source.name}:`, err);
            setSensorData((prev) =>
              prev.map((s) =>
                s.sourceId === source._id
                  ? { ...s, value: "Error loading", status: "offline" }
                  : s
              )
            );
          }
        });
      }
    } catch (error) {
      console.error("Load overview error:", error);
      toast.error("Failed to load overview data");
    }
  };

  const handleViewDashboard = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  console.log("sensor data", sensorData);

  const handleBackFromView = () => {
    setSelectedDashboard(null);
  };

  const handleDeleteDashboard = async (id) => {
    if (!confirm("Are you sure you want to delete this dashboard?")) return;

    try {
      await axios.delete(`/dashboard/${id}`);
      setDashboards(dashboards.filter((d) => d._id !== id));
      toast.success("Dashboard deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete dashboard");
    }
  };

  if (selectedDashboard) {
    return (
      <LiveDashboardView
        dashboard={selectedDashboard}
        onBack={handleBackFromView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Analytics Platform
              </h1>
              <p className="text-slate-400">
                Real-time monitoring & AI-powered insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  (window.location.href = "/builder/factory-layout")
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
              >
                <Plus size={18} /> Create Dashboard
              </button>
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">All Systems Online</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-700">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("dashboards")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "dashboards"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              My Dashboards ({dashboards.length})
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "analytics"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            sensorData={sensorData}
            dashboards={dashboards}
          />
        )}

        {activeTab === "dashboards" && (
          <DashboardsTab
            dashboards={dashboards}
            loading={loading}
            onView={handleViewDashboard}
            onDelete={handleDeleteDashboard}
          />
        )}

        {activeTab === "analytics" && <AnalyticsTab dashboards={dashboards} />}
      </div>

      <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40"
        >
          <MessageSquare size={28} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}
    </div>
  );
}

// ============ OVERVIEW TAB ============
const OverviewTab = ({ stats, sensorData, dashboards }) => (
  <>
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Dashboards"
        value={stats.totalDashboards}
        unit="active"
        icon={BarChart3}
        trend={12}
        color="blue"
        subtitle="All published dashboards"
      />
      <StatCard
        title="Data Sources"
        value={stats.dataSources}
        unit="connected"
        icon={Database}
        trend={null}
        color="green"
        subtitle="All protocols active"
      />
      <StatCard
        title="Total Views"
        value={stats.totalViews}
        unit="total"
        icon={Eye}
        trend={18}
        color="purple"
        subtitle={dashboards[0]?.name || "No dashboards"}
      />
      <StatCard
        title="Alerts"
        value={stats.activeAlerts}
        unit="active"
        icon={AlertTriangle}
        trend={-25}
        color="red"
        subtitle="All systems normal"
      />
    </div>

    {/* Data Table */}
    <DataTable data={sensorData} />
  </>
);

// ============ DASHBOARDS TAB ============
const DashboardsTab = ({ dashboards, loading, onView, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-semibold">Your Dashboards</h2>
        <button
          onClick={() => navigate(`/builder/factory-layout`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <Plus size={18} /> New Dashboard
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2
            className="animate-spin text-blue-400 mx-auto mb-4"
            size={48}
          />
          <p className="text-slate-400">Loading dashboards...</p>
        </div>
      ) : dashboards.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="text-slate-600 mx-auto mb-4" size={48} />
          <p className="text-slate-400 mb-4">No dashboards yet</p>
          <button
            onClick={() => navigate("/builder/factory-layout")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Create Your First Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <DashboardCard
              key={dashboard._id}
              dashboard={dashboard}
              onView={onView}
              onEdit={(d) => navigate(`/dashboard/preview/${d._id}`)}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============ LIVE DASHBOARD VIEW ============
const LiveDashboardView = ({ dashboard, onBack }) => {
  const [widgets, setWidgets] = useState([]);
  const [liveData, setLiveData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [layouts, setLayouts] = useState({ lg: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [dashboard]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!isEditMode) {
  //       loadLiveData();
  //     }
  //   }, dashboard.config?.refreshInterval || 5000);

  //   return () => clearInterval(interval);
  // }, [dashboard, isEditMode]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/dashboard/${dashboard._id}`);

      if (response.data) {
        const dashboardData = response.data.dashboard;
        const widgetList = dashboardData.config?.widgets || [];
        setWidgets(widgetList);

        const gridLayouts = widgetList.map((w) => ({
          i: w.id,
          x: w.position?.x || 0,
          y: w.position?.y || 0,
          w: w.position?.w || 6,
          h: w.position?.h || 3,
          minW: 2,
          minH: 2,
        }));

        setLayouts({ lg: gridLayouts });
      }

      await loadLiveData();
    } catch (error) {
      console.error("Load dashboard error:", error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadLiveData = async () => {
    try {
      const response = await axios.get(`/dashboard/live/${dashboard._id}`);
      setLiveData(response.data || {});
    } catch (error) {
      console.error("Load live data error:", error);
    }
  };

  const handleLayoutChange = (layout) => {
    setLayouts({ lg: layout });

    const updatedWidgets = widgets.map((widget) => {
      const layoutItem = layout.find((l) => l.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        };
      }
      return widget;
    });

    setWidgets(updatedWidgets);
  };

  const handleSaveLayout = async () => {
    try {
      await axios.put(`/dashboard/${dashboard._id}`, {
        config: {
          ...dashboard.config,
          widgets: widgets,
        },
      });

      setIsEditMode(false);
      toast.success("Layout saved successfully!");
    } catch (error) {
      console.error("Save layout error:", error);
      toast.error("Failed to save layout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-400" size={48} />
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
                onClick={onBack}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                <ArrowLeft className="text-white" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {dashboard.name}
                </h1>
                <p className="text-slate-400 text-sm">
                  {dashboard.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLayout}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Download size={18} /> Save Layout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2"
                  >
                    <Edit size={18} /> Edit Layout
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition flex items-center gap-2">
                    <Share2 size={18} /> Share
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2">
                    <Download size={18} /> Export
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-[1920px] mx-auto">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          isDraggable={isEditMode}
          isResizable={isEditMode}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
            >
              <DashboardWidget
                widget={widget}
                data={liveData?.liveData?.[widget.id]}
                isEditMode={isEditMode}
              />
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

// ============ DASHBOARD WIDGET RENDERER ============
const DashboardWidget = ({ widget, data, isEditMode }) => {
  console.log("widget", widget);
  console.log("data", data);
  if (!data) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-700/50">
          <div className="flex items-center gap-2">
            {isEditMode && (
              <GripVertical
                size={16}
                className="text-slate-400 cursor-move drag-handle"
              />
            )}
            <span className="text-white text-sm font-medium">
              {widget.title}
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-600" size={32} />
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-700/50">
          <span className="text-white text-sm font-medium">{widget.title}</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-red-400">
          <p>{data.error}</p>
        </div>
      </div>
    );
  }

  const renderWidget = () => {
    switch (widget.type) {
      case "line-chart":
        return <LineChartWidget widget={widget} data={data} />;
      case "gauge":
        return <GaugeWidget widget={widget} data={data} />;
      case "stat-card":
        return <StatCardWidget widget={widget} data={data} />;
      case "table":
        return <TableWidget widget={widget} data={data} />;
      case "bar-chart":
        return <BarChartWidget widget={widget} data={data} />;
      default:
        return <div className="p-4 text-white">Widget: {widget.type}</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-700/50">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <GripVertical
              size={16}
              className="text-slate-400 cursor-move drag-handle"
            />
          )}
          <span className="text-white text-sm font-medium">{widget.title}</span>
        </div>
      </div>
      <div className="p-4 flex-1 overflow-auto">{renderWidget()}</div>
    </div>
  );
};

// ============ WIDGET COMPONENTS ============
const LineChartWidget = ({ widget, data }) => {
  if (!data.history || data.history.length === 0) {
    return <EmptyWidget message="No data available" />;
  }

  const chartData = data.history.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  return (
    <div className="h-full">
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const GaugeWidget = ({ widget, data }) => {
  const value = data.current || 0;
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
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{value}</span>
          <span className="text-slate-400 text-sm">
            {widget.settings?.unit}
          </span>
        </div>
      </div>
    </div>
  );
};

const StatCardWidget = ({ widget, data }) => (
  <div className="h-full flex flex-col justify-center items-center text-center">
    <div className="text-5xl font-bold text-white mb-2">
      {data.current || 0}
    </div>
    {widget.settings?.unit && (
      <span className="text-slate-400">{widget.settings.unit}</span>
    )}
  </div>
);

const TableWidget = ({ widget, data }) => {
  if (!data.rows || data.rows.length === 0) {
    return <EmptyWidget message="No data available" />;
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-slate-700">
          <tr>
            {data.columns.map((col) => (
              <th key={col} className="text-left p-2 text-slate-300">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-700">
              {data.columns.map((col) => (
                <td key={col} className="p-2 text-white">
                  {col === "timestamp"
                    ? new Date(row[col]).toLocaleString()
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BarChartWidget = ({ widget, data }) => {
  if (!data.history) return <EmptyWidget message="No data" />;

  const chartData = data.history.slice(-15).map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: item.value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const EmptyWidget = ({ message }) => (
  <div className="h-full flex flex-col items-center justify-center text-slate-500">
    <BarChart3 size={32} className="mb-2" />
    <p>{message}</p>
  </div>
);

// ============ SUPPORTING COMPONENTS ============
const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
  subtitle,
}) => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-${color}-500/10`}>
        <Icon className={`text-${color}-400`} size={24} />
      </div>
      {trend !== null && (
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
            trend > 0
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <p className="text-slate-400 text-sm mb-1">{title}</p>
    <div className="flex items-baseline gap-2 mb-1">
      <h3 className="text-3xl font-bold text-white">{value}</h3>
      {unit && <span className="text-slate-400 text-sm">{unit}</span>}
    </div>
    {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
  </div>
);

const DataTable = ({ data }) => (
  <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
    <div className="p-6 border-b border-slate-700">
      <h3 className="text-white font-semibold text-lg">
        Recent Sensor Readings
      </h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Source
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Protocol
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Value
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Status
            </th>
            <th className="text-left text-slate-300 text-sm font-medium p-4">
              Last Update
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-700/30 transition-colors">
              <td className="p-4 text-white font-medium">{row.source}</td>
              <td className="p-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    row.protocol === "MQTT"
                      ? "bg-green-500/10 text-green-400"
                      : row.protocol === "Modbus TCP"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-orange-500/10 text-orange-400"
                  }`}
                >
                  {row.protocol}
                </span>
              </td>
              <td className="p-4 text-white font-mono">{row.value}</td>
              <td className="p-4">
                {row.status === "connected" ? (
                  <span className="flex items-center gap-1.5 text-green-400 text-sm">
                    <Wifi size={14} /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-red-400 text-sm">
                    <WifiOff size={14} /> Offline
                  </span>
                )}
              </td>
              <td className="p-4 text-slate-400 text-sm">{row.lastUpdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const DashboardCard = ({ dashboard, onView, onEdit, onDelete }) => (
  <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <h4 className="text-white font-semibold text-lg mb-1">
          {dashboard.name}
        </h4>
        <p className="text-slate-400 text-sm">
          {dashboard.description || "Dashboard"}
        </p>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          dashboard.status === "live"
            ? "bg-green-500/10 text-green-400"
            : "bg-slate-700 text-slate-400"
        }`}
      >
        {dashboard.status || "draft"}
      </div>
    </div>

    <div className="flex items-center gap-4 mb-5 text-sm text-slate-400">
      <span className="flex items-center gap-1">
        <Eye size={14} /> {dashboard.viewCount || 0}
      </span>
      <span className="flex items-center gap-1">
        <Clock size={14} /> {new Date(dashboard.updatedAt).toLocaleDateString()}
      </span>
    </div>

    <div className="flex gap-2">
      <button
        onClick={() => onView(dashboard)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
      >
        <Eye size={16} /> View
      </button>
      <button
        onClick={() => onEdit(dashboard)}
        className="px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={() => onDelete(dashboard._id)}
        className="px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

// ============ ANALYTICS TAB ============
const AnalyticsTab = ({ dashboards }) => {
  const protocolStats = {
    mqtt: { count: 9, percentage: 37.5, trend: 12, dataPoints: 45678 },
    modbus: { count: 8, percentage: 33.3, trend: 5, dataPoints: 32145 },
    rs485: { count: 7, percentage: 29.2, trend: -3, dataPoints: 28934 },
  };

  const performanceMetrics = [
    { name: "Avg Response Time", value: "45ms", trend: -12, status: "good" },
    { name: "Data Success Rate", value: "99.7%", trend: 2.3, status: "good" },
    { name: "Uptime", value: "99.9%", trend: 0.1, status: "excellent" },
    { name: "Failed Requests", value: "23", trend: -45, status: "good" },
  ];

  const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    messages: 150 + Math.random() * 200,
  }));

  const topDashboards = [...dashboards]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-2xl font-semibold mb-1">
            Advanced Analytics
          </h2>
          <p className="text-slate-400 text-sm">
            Real-time insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm">
            Last 7 Days
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm">
            Export Report
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {performanceMetrics.map((metric, i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-xl p-5 border border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">{metric.name}</span>
              <div
                className={`flex items-center gap-1 text-xs ${
                  metric.trend > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {metric.trend > 0 ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                <span>{Math.abs(metric.trend)}%</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {metric.value}
            </div>
            <div
              className={`inline-block px-2 py-0.5 rounded text-xs ${
                metric.status === "excellent"
                  ? "bg-green-500/10 text-green-400"
                  : metric.status === "good"
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-orange-500/10 text-orange-400"
              }`}
            >
              {metric.status === "excellent"
                ? "Excellent"
                : metric.status === "good"
                ? "Good"
                : "Fair"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Protocol Distribution */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Activity size={18} />
            Protocol Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(protocolStats).map(([key, stats]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        key === "mqtt"
                          ? "bg-green-500"
                          : key === "modbus"
                          ? "bg-blue-500"
                          : "bg-orange-500"
                      }`}
                    ></div>
                    <span className="text-slate-300 font-medium">
                      {key.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{stats.count}</div>
                    <div className="text-slate-400 text-xs">
                      {stats.percentage}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      key === "mqtt"
                        ? "bg-green-500"
                        : key === "modbus"
                        ? "bg-blue-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Activity */}
        <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Zap size={18} />
              24-Hour Activity
            </h3>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {hourlyActivity.map((item, i) => {
              const max = Math.max(...hourlyActivity.map((h) => h.messages));
              const height = (item.messages / max) * 100;
              return (
                <div key={i} className="flex-1">
                  <div
                    className="w-full rounded-t bg-gradient-to-t from-slate-600 to-slate-500 hover:from-blue-600 hover:to-blue-400 transition-all cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${item.hour}:00 - ${Math.round(
                      item.messages
                    )} messages`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Dashboards & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <TrendingUp size={18} />
            Top Performing Dashboards
          </h3>
          <div className="space-y-4">
            {topDashboards.length > 0 ? (
              topDashboards.map((d, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      i === 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : i === 1
                        ? "bg-slate-600/50 text-slate-300"
                        : i === 2
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{d.name}</div>
                    <div className="text-slate-400 text-xs">
                      {d.description || "Dashboard"}
                    </div>
                  </div>
                  <div className="text-white font-bold">{d.viewCount || 0}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No dashboard data
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <CheckCircle size={18} />
            System Health
          </h3>
          <div className="space-y-4">
            {[
              { label: "Data Sources Online", value: "24/24", color: "green" },
              { label: "Active Connections", value: "156", color: "blue" },
              { label: "Avg Latency", value: "45ms", color: "purple" },
              { label: "Error Rate", value: "0.3%", color: "orange" },
              { label: "System Uptime", value: "99.9%", color: "green" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 bg-${item.color}-400 rounded-full ${
                      i === 0 ? "animate-pulse" : ""
                    }`}
                  ></div>
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ AI CHAT DRAWER ============
const AIChatDrawer = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your IoT AI assistant. I can help you analyze data, create dashboards, and monitor your sensors. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    setTimeout(() => {
      const responses = [
        "Based on your temperature data from the last 24 hours, the average is 24.5°C with a peak of 29.3°C at 2:00 PM.",
        "I've detected that your Factory Floor dashboard has been viewed 234 times. Would you like me to create a detailed report?",
        "Your MQTT sources are all connected and reporting data normally. The humidity levels in Zone A have increased by 12% in the last hour.",
        "Power consumption is up 15% compared to last month. Should I create an energy optimization dashboard for you?",
        "I can create a new dashboard for you! What metrics would you like to monitor? (Temperature, Humidity, Power, etc.)",
        "All data sources are connected and online. Your system is running smoothly!",
      ];

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: responses[Math.floor(Math.random() * responses.length)],
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-slate-800 shadow-2xl transform transition-transform duration-300 z-50 border-l border-slate-700 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-xs">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-slate-700 text-white rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-white p-3 rounded-2xl rounded-bl-none">
                <Loader2 className="animate-spin" size={16} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white p-2.5 rounded-lg transition"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
