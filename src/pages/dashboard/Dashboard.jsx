import { useState, useEffect } from "react";
import {
  Plus,
  BarChart3,
  Database,
  Eye,
  AlertTriangle,
  MessageSquare,
} from "lucide-react";

// Import components
import StatCard from "./components/StatCard";
import MiniChart from "./components/MiniChart";
import DashboardCard from "./components/DashboardCard";
import DataTable from "./components/DataTable";
import AIChatbot from "./components/AIChatbot";
import DashboardView from "./components/DashboardView";
import AnalyticsTab from "./components/AnalyticsTab";

// Mock dashboards data
const mockDashboards = [
  {
    id: 1,
    name: "Factory Floor Overview",
    type: "Real-time Monitoring",
    lastUpdated: "2 mins ago",
    views: 234,
    status: "active",
  },
  {
    id: 2,
    name: "Temperature Analytics",
    type: "Historical Analysis",
    lastUpdated: "5 mins ago",
    views: 156,
    status: "active",
  },
  {
    id: 3,
    name: "Power Consumption Report",
    type: "Energy Management",
    lastUpdated: "10 mins ago",
    views: 89,
    status: "active",
  },
  {
    id: 4,
    name: "Humidity Control Dashboard",
    type: "Environmental",
    lastUpdated: "15 mins ago",
    views: 67,
    status: "inactive",
  },
  {
    id: 5,
    name: "Machine Health Monitor",
    type: "Predictive Maintenance",
    lastUpdated: "1 hour ago",
    views: 312,
    status: "active",
  },
];

export default function Dashboard() {
  const [dashboards, setDashboards] = useState(mockDashboards);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDashboard, setSelectedDashboard] = useState(null);

  // Real-time data states
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    temperature: {
      data: Array.from({ length: 24 }, () => 20 + Math.random() * 10),
      current: 24.5,
    },
    humidity: {
      data: Array.from({ length: 24 }, () => 40 + Math.random() * 30),
      current: 65,
    },
    power: {
      data: Array.from({ length: 24 }, () => 150 + Math.random() * 100),
      current: 202,
    },
    pressure: {
      data: Array.from({ length: 24 }, () => 100 + Math.random() * 20),
      current: 108,
    },
    flow: {
      data: Array.from({ length: 24 }, () => 20 + Math.random() * 30),
      current: 35,
    },
    vibration: {
      data: Array.from({ length: 24 }, () => 0.5 + Math.random() * 1.5),
      current: 1.2,
    },
  });

  const sensorData = [
    {
      source: "Temperature Sensor A",
      protocol: "MQTT",
      value: "24.5°C",
      status: "online",
      lastUpdate: "2s ago",
    },
    {
      source: "Humidity Monitor",
      protocol: "MQTT",
      value: "65%",
      status: "online",
      lastUpdate: "5s ago",
    },
    {
      source: "Factory PLC",
      protocol: "Modbus TCP",
      value: "1234",
      status: "online",
      lastUpdate: "10s ago",
    },
    {
      source: "Power Meter",
      protocol: "RS485",
      value: "250W",
      status: "online",
      lastUpdate: "15s ago",
    },
    {
      source: "Pressure Sensor",
      protocol: "MQTT",
      value: "101.3 kPa",
      status: "offline",
      lastUpdate: "5m ago",
    },
    {
      source: "Flow Meter",
      protocol: "Modbus TCP",
      value: "45 L/min",
      status: "online",
      lastUpdate: "3s ago",
    },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeMetrics({
        temperature: {
          data: Array.from({ length: 24 }, () => 20 + Math.random() * 10),
          current: (20 + Math.random() * 10).toFixed(1),
        },
        humidity: {
          data: Array.from({ length: 24 }, () => 40 + Math.random() * 30),
          current: (40 + Math.random() * 30).toFixed(0),
        },
        power: {
          data: Array.from({ length: 24 }, () => 150 + Math.random() * 100),
          current: (150 + Math.random() * 100).toFixed(0),
        },
        pressure: {
          data: Array.from({ length: 24 }, () => 100 + Math.random() * 20),
          current: (100 + Math.random() * 20).toFixed(1),
        },
        flow: {
          data: Array.from({ length: 24 }, () => 20 + Math.random() * 30),
          current: (20 + Math.random() * 30).toFixed(1),
        },
        vibration: {
          data: Array.from({ length: 24 }, () => 0.5 + Math.random() * 1.5),
          current: (0.5 + Math.random() * 1.5).toFixed(2),
        },
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleViewDashboard = (dashboard) => {
    setSelectedDashboard(dashboard);
  };

  const handleBackFromView = () => {
    setSelectedDashboard(null);
  };

  const handleDeleteDashboard = (id) => {
    if (confirm("Are you sure you want to delete this dashboard?")) {
      setDashboards(dashboards.filter((d) => d.id !== id));
    }
  };

  // If viewing a dashboard, show DashboardView component
  if (selectedDashboard) {
    return (
      <DashboardView
        dashboard={selectedDashboard}
        onBack={handleBackFromView}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 top-0 z-30">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                IoT Analytics Platform
              </h1>
              <p className="text-slate-400">
                Real-time monitoring & AI-powered insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
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
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Dashboards"
                value={dashboards.length}
                unit="active"
                icon={BarChart3}
                trend={12}
                color="blue"
                subtitle="2 created this week"
              />
              <StatCard
                title="Data Sources"
                value="24"
                unit="connected"
                icon={Database}
                trend={null}
                color="green"
                subtitle="9 MQTT, 8 Modbus, 7 RS485"
              />
              <StatCard
                title="Total Views"
                value="1.2K"
                unit="this month"
                icon={Eye}
                trend={18}
                color="purple"
                subtitle="Factory Floor most viewed"
              />
              <StatCard
                title="Alerts"
                value="3"
                unit="active"
                icon={AlertTriangle}
                trend={-25}
                color="red"
                subtitle="2 resolved today"
              />
            </div>

            {/* Real-time Metrics */}
            <div className="mb-8">
              <h2 className="text-white text-xl font-semibold mb-4">
                Real-time Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MiniChart
                  title="Temperature"
                  data={realtimeMetrics.temperature.data}
                  color="red"
                  currentValue={realtimeMetrics.temperature.current}
                  unit="°C"
                />
                <MiniChart
                  title="Humidity"
                  data={realtimeMetrics.humidity.data}
                  color="blue"
                  currentValue={realtimeMetrics.humidity.current}
                  unit="%"
                />
                <MiniChart
                  title="Power"
                  data={realtimeMetrics.power.data}
                  color="purple"
                  currentValue={realtimeMetrics.power.current}
                  unit="W"
                />
                <MiniChart
                  title="Pressure"
                  data={realtimeMetrics.pressure.data}
                  color="green"
                  currentValue={realtimeMetrics.pressure.current}
                  unit="kPa"
                />
                <MiniChart
                  title="Flow Rate"
                  data={realtimeMetrics.flow.data}
                  color="cyan"
                  currentValue={realtimeMetrics.flow.current}
                  unit="L/min"
                />
                <MiniChart
                  title="Vibration"
                  data={realtimeMetrics.vibration.data}
                  color="orange"
                  currentValue={realtimeMetrics.vibration.current}
                  unit="mm/s"
                />
              </div>
            </div>

            {/* Data Table */}
            <DataTable data={sensorData} />
          </>
        )}

        {/* Dashboards Tab */}
        {activeTab === "dashboards" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">
                Your Dashboards
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2">
                <Plus size={18} /> New Dashboard
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboards.map((dashboard) => (
                <DashboardCard
                  key={dashboard.id}
                  dashboard={dashboard}
                  onView={handleViewDashboard}
                  onEdit={(d) =>
                    alert(`Edit functionality coming soon for: ${d.name}`)
                  }
                  onDelete={handleDeleteDashboard}
                />
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsTab dashboards={dashboards} />}
      </div>

      {/* AI Chatbot */}
      <AIChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMinimize={() => setIsChatMinimized(!isChatMinimized)}
        isMinimized={isChatMinimized}
      />

      {/* Floating AI Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40 group"
        >
          <MessageSquare size={28} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
              Ask AI Assistant
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
