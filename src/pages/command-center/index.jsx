/*
CommandCenterDark.jsx
- Tailwind CSS dark-themed React component version of your Command Center page.
- Uses: react, react-router-dom (useNavigate), lucide-react, recharts

How to use:
1. Ensure tailwindcss is configured (tailwind v4). In your index.css include:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

2. Place this file in your components folder and import where needed.
3. Dependencies used (from your list): lucide-react, recharts, react-router-dom.

You can tweak colors by changing Tailwind classes.
*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  List,
  Play,
  AlertTriangle,
  Clock,
  Bell,
  BarChart2,
  CheckCircle,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Sidebar categories with icons
const SIDEBAR_CATEGORIES = [
  { label: "All Workflows", key: "all", icon: List },
  { label: "Running", key: "running", icon: Play },
  { label: "Failed", key: "failed", icon: AlertTriangle },
  { label: "Scheduled", key: "scheduled", icon: Clock },
  { label: "Alerts", key: "alerts", icon: Bell },
];

const MONITORING = [
  { label: "Activity Log", icon: List },
  { label: "Performance", icon: BarChart2 },
];

const SUMMARY = [
  {
    label: "Total Workflows",
    value: 42,
    color: "bg-gradient-to-br from-sky-700 to-sky-900",
    key: "all",
  },
  {
    label: "Running Workflows",
    value: 5,
    color: "bg-gradient-to-br from-orange-600 to-orange-800",
    key: "running",
  },
  {
    label: "Failed Workflows",
    value: 2,
    color: "bg-gradient-to-br from-red-600 to-red-800",
    key: "failed",
  },
  {
    label: "System Status",
    value: "operational",
    color: "bg-gradient-to-br from-green-700 to-green-900",
    key: "system",
  },
];

const RECENT_ACTIVITY = [
  { name: "Email Campaign #123", time: "2 min ago", status: "completed" },
  { name: "Daily Backup", time: "5 min ago", status: "running" },
  { name: "User Onboarding #45", time: "10 min ago", status: "failed" },
  { name: "Report Generation", time: "15 min ago", status: "completed" },
];
const ALERTS = [
  { name: "High CPU Usage on Server A", time: "5 min ago", status: "critical" },
  { name: "Database Connection Error", time: "12 min ago", status: "critical" },
  { name: "Low Disk Space on Volume B", time: "1 hour ago", status: "warning" },
];

// Pie chart mock data
const PIE_DATA = [
  { name: "Running", value: 5, color: "#F59E0B" },
  { name: "Failed", value: 2, color: "#EF4444" },
  { name: "Completed", value: 35, color: "#3B82F6" },
];

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium";
  if (status === "completed")
    return <span className={`${base} bg-sky-800 text-sky-200`}>Completed</span>;
  if (status === "running")
    return (
      <span className={`${base} bg-orange-900 text-orange-200`}>Running</span>
    );
  if (status === "failed")
    return <span className={`${base} bg-red-900 text-red-200`}>Failed</span>;
  if (status === "critical")
    return <span className={`${base} bg-red-900 text-red-200`}>Critical</span>;
  if (status === "warning")
    return (
      <span className={`${base} bg-yellow-900 text-yellow-200`}>Warning</span>
    );
  return <span className={`${base} bg-gray-800 text-gray-300`}>{status}</span>;
}

export default function CommandCenterDark() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("all");
  const navigate = useNavigate();

  const handleSummaryClick = (key) => {
    // if (key === "system") return;
    // setActive(key);
    // navigate(`/pipelines?filter=${key}`);
  };
  const handleSidebarClick = (key) => {
    // setActive(key);
    // navigate(`/pipelines?filter=${key}`);
  };
  const handleCreateWorkflow = () => {
    // navigate("/pipelines/create");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-sky-300">
            Command Center
          </h1>
        </div>

        <div className="mb-4 text-gray-400 uppercase tracking-wider text-xs font-semibold">
          Workflows
        </div>
        <nav className="space-y-1 mb-6">
          {SIDEBAR_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const activeClass =
              active === cat.key
                ? "bg-sky-800 text-sky-100"
                : "text-gray-300 hover:bg-gray-800";
            return (
              <button
                key={cat.key}
                onClick={() => handleSidebarClick(cat.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${activeClass} transition`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1 text-left">{cat.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mb-2 text-gray-400 uppercase tracking-wider text-xs font-semibold">
          Monitoring
        </div>
        <div className="space-y-1">
          {MONITORING.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800"
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto text-xs text-gray-500 pt-6">
          <div>
            App Version: <span className="text-gray-400">2.1.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex items-center gap-4 px-8 py-4 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <input
              className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
              placeholder="Search workflows..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* <div className="ml-auto flex items-center gap-3">
            <button
              onClick={handleCreateWorkflow}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
          </div> */}
        </div>

        <div className="p-8 overflow-auto">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {SUMMARY.map((s) => (
              <div
                key={s.label}
                onClick={() => handleSummaryClick(s.key)}
                className={`p-6 rounded-2xl shadow-sm cursor-pointer transform transition hover:-translate-y-1 ${s.color}`}
              >
                <div className="text-gray-200 text-sm mb-2">{s.label}</div>
                {s.key === "system" ? (
                  <div className="inline-flex items-center gap-2 bg-green-800 text-green-200 px-3 py-1 rounded-full text-sm">
                    Operational
                  </div>
                ) : (
                  <div className="text-3xl font-semibold text-white">
                    {s.value}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Card */}
            <div className="bg-gray-900 rounded-lg shadow p-6 min-h-[260px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-100">
                  Workflow Status Overview
                </h2>
              </div>
              <div className="w-full h-44">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f1724",
                        border: "1px solid #334155",
                        color: "#cbd5e1",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 rounded-lg shadow p-6 min-h-[260px]">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">
                Recent Activity
              </h2>
              <div className="flex flex-col gap-3">
                {RECENT_ACTIVITY.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        {a.name}
                      </div>
                      <div className="text-xs text-gray-400">{a.time}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts (full-width on small screens) */}
            <div className="bg-gray-900 rounded-lg shadow p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">
                Active Alerts
              </h2>
              <div className="flex flex-col gap-3">
                {ALERTS.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-100">
                        {a.name}
                      </div>
                      <div className="text-xs text-gray-400">{a.time}</div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-400 px-8 py-3 flex items-center justify-between text-sm">
          <div>Data Sync: real-time • Last Activity: Just now</div>
          <div>Active Users: 12 • App Version: 2.1.0</div>
        </footer>
      </main>
    </div>
  );
}
