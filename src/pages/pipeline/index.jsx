// Pipelines.jsx  (replace your current file with this)
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Square,
  Pencil,
  Plus,
  FolderOpen,
  AlertTriangle,
  CheckCircle2,
  Clock,
  LineChart as LineChartIcon,
  ArrowLeft,
} from "lucide-react";
import WorkflowDiagram from "./WorkflowDiagram";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";

/*
 Optional: a reference to the screenshot you uploaded earlier.
 The runtime / platform will transform this sandbox path into a usable URL.
*/
const headerImage =
  "sandbox:/mnt/data/908ce18f-9269-4064-bbb4-4e1fc65c607f.png";

function getWorkflows() {
  return JSON.parse(localStorage.getItem("workflows") || "[]");
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function Pipelines() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();

  useEffect(() => {
    const wfs = getWorkflows();
    setWorkflows(wfs);
    if (wfs.length && !selectedId) setSelectedId(wfs[0].id);
  }, [selectedId]);

  const filtered = workflows.filter((wf) =>
    (wf.name || "").toLowerCase().includes(search.toLowerCase())
  );
  const selectedWorkflow =
    filtered.find((wf) => wf.id === selectedId) || filtered[0];

  const graph = useMemo(() => {
    try {
      const all = JSON.parse(localStorage.getItem("workflowGraphs") || "{}");
      return selectedWorkflow
        ? all[selectedWorkflow.id] || { nodes: [], edges: [] }
        : { nodes: [], edges: [] };
    } catch {
      return { nodes: [], edges: [] };
    }
  }, [selectedWorkflow?.id]);

  const linkedWidget = useMemo(() => {
    try {
      const wtw = JSON.parse(localStorage.getItem("workflowToWidget") || "{}");
      return selectedWorkflow ? wtw[selectedWorkflow.id] : null;
    } catch {
      return null;
    }
  }, [selectedWorkflow?.id]);

  // synthetic performance data
  const points = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30;
  const labels = Array.from({ length: points }).map((_, i) =>
    timeRange === "24h" ? `${i}:00` : `D-${points - i}`
  );

  const efficiencySeries = useMemo(
    () =>
      labels.map((t) => ({
        t,
        throughput: random(180, 520),
        latency: random(80, 300),
        errors: random(0, 18),
        cost: random(40, 120),
        cpu: random(20, 92),
        mem: random(18, 86),
      })),
    [timeRange]
  );

  const p95Latency = useMemo(
    () => Math.max(...efficiencySeries.map((d) => d.latency)),
    [efficiencySeries]
  );
  const avgThroughput = useMemo(
    () =>
      Math.round(
        efficiencySeries.reduce((a, b) => a + b.throughput, 0) /
          efficiencySeries.length || 0
      ),
    [efficiencySeries]
  );
  const errorRate = useMemo(
    () =>
      (
        efficiencySeries.reduce((a, b) => a + b.errors, 0) /
        (efficiencySeries.length * 500 || 1)
      ).toFixed(2),
    [efficiencySeries]
  );

  const infraPie = [
    { name: "Healthy", value: 82, color: "#22c55e" },
    { name: "Warning", value: 14, color: "#eab308" },
    { name: "Critical", value: 4, color: "#ef4444" },
  ];

  const logsRaw = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        level:
          i % 11 === 0
            ? "error"
            : i % 6 === 0
            ? "warn"
            : i % 2 === 0
            ? "info"
            : "debug",
        ts: new Date(Date.now() - i * 15 * 60_000).toLocaleString(),
        node: [
          "postgres",
          "filter",
          "select",
          "aggregate",
          "conditional",
          "kafka",
          "warehouse",
        ][i % 7],
        msg:
          i % 11 === 0
            ? `Error: timeout in node api-${(i % 3) + 1} after 30s (retry ${
                i % 3
              }).`
            : i % 6 === 0
            ? "Backoff retry succeeded for db-reader."
            : i % 2 === 0
            ? "Processed batch successfully."
            : "Fetched 500 rows from source.",
      })),
    []
  );

  const logs = logsRaw.filter((l) =>
    logFilter === "all" ? true : l.level === logFilter
  );

  const recentIssues = [
    {
      icon: AlertTriangle,
      color: "text-red-400",
      text: "3 failed runs in last 24h (node: api)",
    },
    {
      icon: Clock,
      color: "text-amber-300",
      text: "Latency p95 above target during 16:00-18:00",
    },
    {
      icon: CheckCircle2,
      color: "text-emerald-400",
      text: "SLA met for 12 consecutive days",
    },
  ];

  const tabBtnBase =
    "px-4 py-2 text-xs md:text-sm rounded-xl font-medium transition-colors border border-transparent";
  const getTabClasses = (tab) =>
    activeTab === tab
      ? `${tabBtnBase} bg-blue-500 text-white shadow`
      : `${tabBtnBase} bg-[#061020] text-slate-200 hover:bg-[#09172c] border-[#142842]`;

  const cpuUsage = 62;
  const memUsage = 48;
  const diskUsage = 71;

  return (
    <div className="min-h-screen text-slate-50 ">
      <div className="flex">
        {/* Left list */}
        <aside className="w-[320px] border-r border-[#142842] min-h-screen px-6 py-6 hidden md:block">
          <div className="flex flex-col gap-6 h-full">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-2xl bg-blue-500/12 flex items-center justify-center border border-blue-500/40 backdrop-blur-sm">
                  <LineChartIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight">
                    Data Pipelines
                  </h1>
                  <p className="text-xs text-slate-400">
                    Orchestrate your data flows
                  </p>
                </div>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search pipelines..."
                className="w-full h-10 rounded-xl border border-[#1c2744] px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 bg-[#04081a]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              {filtered.map((wf) => {
                const isActive = selectedId === wf.id;
                return (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => setSelectedId(wf.id)}
                    className={[
                      "relative w-full text-left rounded-2xl px-4 py-3 transition-all border flex flex-col gap-1.5",
                      isActive
                        ? " border-blue-500/70 bg-gradient-to-r from-[#03132a]/60 to-[#051a2f]/40"
                        : "bg-[#050815] border-[#1c2744] hover:border-[#2f3e63] hover:bg-[#071022]",
                    ].join(" ")}
                  >
                    {isActive && (
                      <div className="absolute inset-y-2 left-2 w-[3px] rounded-full bg-gradient-to-b from-blue-400 to-emerald-400" />
                    )}
                    <div className="flex items-start justify-between gap-3 pl-1">
                      <div className="flex-1">
                        <p className="text-sm font-semibold truncate">
                          {wf.name}
                        </p>
                      </div>
                      <span
                        className={[
                          "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
                          wf.status === "running"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/50"
                            : "bg-[#0b172a] text-slate-300 border border-[#1f2937]",
                        ].join(" ")}
                      >
                        {wf.status || "IDLE"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Last updated • synthetic</span>
                      {linkedWidget && selectedWorkflow?.id === wf.id && (
                        <span className="text-blue-300/90">
                          Widget: {linkedWidget.widgetName}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-1 border-t border-[#142842]">
              <button
                type="button"
                onClick={() => navigate("/pipelines/create")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 text-white text-sm font-medium h-11 active:scale-[.997] transition-transform shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Create New Pipeline
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-[#142842] p-5 md:p-8 backdrop-blur-sm bg-gradient-to-b from-[#051223]/40 to-[#031025]/30 shadow-md">
              {!filtered.length ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 text-slate-400">
                  <div className="p-6 rounded-full bg-[#071022] border border-[#142842] shadow-inner">
                    <FolderOpen className="h-10 w-10 text-slate-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-semibold text-slate-50">
                      No data pipelines found
                    </h2>
                    <p className="text-sm text-slate-400">
                      Start by creating your first data pipeline.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/pipelines/create")}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-500 text-white text-sm font-medium px-6 py-2.5 transition-shadow shadow"
                  >
                    <Plus className="h-4 w-4" />
                    Create Pipeline
                  </button>
                </div>
              ) : (
                <>
                  {/* header with Back button */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#031428] border border-[#133047] text-slate-200 hover:bg-[#042033] transition-shadow shadow-sm"
                        aria-label="Back"
                      >
                        <ArrowLeft className="h-4 w-4 text-slate-200" />
                        <span className="text-sm">Back</span>
                      </button>

                      <div>
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
                          {selectedWorkflow?.name || "Select a pipeline"}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
                          {selectedWorkflow?.description ||
                            "No description available for this pipeline."}
                        </p>
                        {linkedWidget && (
                          <p className="mt-1 text-xs text-blue-300">
                            Linked widget:{" "}
                            <span className="font-medium">
                              {linkedWidget.widgetName}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 text-white text-xs md:text-sm font-medium px-3 md:px-4 py-2 shadow-sm"
                      >
                        <Play className="h-4 w-4" />
                        Start
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#050815] text-slate-200 text-xs md:text-sm font-medium px-3 md:px-4 py-2 border border-[#1c2744] hover:bg-[#071022]"
                      >
                        <Square className="h-4 w-4" />
                        Stop
                      </button>
                      {selectedWorkflow && (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/pipelines/edit/${selectedWorkflow.id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500 text-white text-xs md:text-sm font-medium px-3 md:px-4 py-2 shadow"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Pipeline
                        </button>
                      )}
                      <select
                        className="h-9 rounded-xl bg-[#050815] border border-[#1c2744] text-xs md:text-sm text-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <option value="24h">Last 24h</option>
                        <option value="7d">Last 7d</option>
                        <option value="30d">Last 30d</option>
                      </select>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2 mb-5">
                      <button
                        type="button"
                        className={getTabClasses("overview")}
                        onClick={() => setActiveTab("overview")}
                      >
                        Overview
                      </button>
                      <button
                        type="button"
                        className={getTabClasses("logs")}
                        onClick={() => setActiveTab("logs")}
                      >
                        Runs & Logs
                      </button>
                      <button
                        type="button"
                        className={getTabClasses("performance")}
                        onClick={() => setActiveTab("performance")}
                      >
                        Performance
                      </button>
                      <button
                        type="button"
                        className={getTabClasses("diagram")}
                        onClick={() => setActiveTab("diagram")}
                      >
                        Diagram
                      </button>
                      <button
                        type="button"
                        className={getTabClasses("health")}
                        onClick={() => setActiveTab("health")}
                      >
                        Health
                      </button>
                    </div>

                    {/* Overview */}
                    {activeTab === "overview" && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <ModernStatCard
                            label="Avg Throughput"
                            value={`${avgThroughput}`}
                            unit="events/min"
                            trend="+12% vs baseline"
                            trendUp={true}
                            icon={LineChartIcon}
                            color="blue"
                          />
                          <ModernStatCard
                            label="p95 Latency"
                            value={`${p95Latency}`}
                            unit="ms"
                            trend="-5% vs last run"
                            trendUp={false}
                            icon={Clock}
                            color="emerald"
                          />
                          <ModernStatCard
                            label="Error Rate"
                            value={`${errorRate}`}
                            unit="%"
                            trend="Target < 0.5%"
                            trendUp={null}
                            icon={AlertTriangle}
                            color="amber"
                          />
                          <ModernStatCard
                            label="SLA Uptime"
                            value="99.91"
                            unit="%"
                            trend="Last 30 days"
                            trendUp={true}
                            icon={CheckCircle2}
                            color="emerald"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-semibold">
                                Performance Trend
                              </h3>
                              <span className="text-[11px] text-slate-400">
                                Throughput & latency
                              </span>
                            </div>
                            <div className="h-56">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={efficiencySeries}>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#111827"
                                  />
                                  <XAxis
                                    dataKey="t"
                                    tick={{
                                      fill: "#9ca3af",
                                      fontSize: 11,
                                    }}
                                  />
                                  <YAxis
                                    tick={{
                                      fill: "#9ca3af",
                                      fontSize: 11,
                                    }}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "#020617",
                                      border: "1px solid #111827",
                                      borderRadius: "8px",
                                      fontSize: "12px",
                                      color: "#e5e7eb",
                                    }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="throughput"
                                    stroke="#3b82f6"
                                    strokeWidth={2.5}
                                    dot={false}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="latency"
                                    stroke="#22c55e"
                                    strokeWidth={2.5}
                                    dot={false}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                            <h3 className="text-sm font-semibold mb-3">
                              What needs attention
                            </h3>
                            <div className="space-y-3 mb-4">
                              {recentIssues.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-3 rounded-xl bg-[#050816] border border-[#1c2744] px-3 py-2.5"
                                >
                                  <div className="h-8 w-8 rounded-full bg-[#050815] flex items-center justify-center">
                                    <it.icon
                                      className={`h-4 w-4 ${it.color}`}
                                    />
                                  </div>
                                  <p className="text-sm text-slate-200">
                                    {it.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="border-t border-[#142842] pt-3 mt-2">
                              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                                Recommended actions
                              </h4>
                              <ul className="space-y-1.5 text-sm text-slate-200">
                                <li>• Raise API node timeout to 45s</li>
                                <li>• Enable batch size auto-tune</li>
                                <li>• Add alert: error rate &gt; 0.7%</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Logs */}
                    {activeTab === "logs" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-2xl bg-[#040a18] border border-[#142842] px-4 py-3">
                          <span className="text-xs font-medium text-slate-400">
                            Filter:
                          </span>
                          <select
                            className="h-9 rounded-xl bg-[#050815] border border-[#1c2744] text-xs md:text-sm text-slate-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                            value={logFilter}
                            onChange={(e) => setLogFilter(e.target.value)}
                          >
                            <option value="all">All Levels</option>
                            <option value="error">Error</option>
                            <option value="warn">Warning</option>
                            <option value="info">Info</option>
                            <option value="debug">Debug</option>
                          </select>
                        </div>

                        <div className="max-h-[420px] overflow-y-auto pr-1 custom-scrollbar space-y-2">
                          {logs.map((l, idx) => {
                            const colorMap = {
                              error:
                                "bg-red-500/15 text-red-300 border-red-500/50",
                              warn: "bg-amber-500/15 text-amber-300 border-amber-500/50",
                              info: "bg-sky-500/15 text-sky-300 border-sky-500/50",
                              debug:
                                "bg-[#071022] text-slate-200 border-[#1f2937]",
                            };
                            return (
                              <div
                                key={idx}
                                className="flex items-start gap-3 rounded-2xl bg-[#050815] border border-[#1c2744] px-3 py-3 hover:border-[#2f3e63] transition-colors"
                              >
                                <span
                                  className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase tracking-wide border ${
                                    colorMap[l.level]
                                  }`}
                                >
                                  {l.level}
                                </span>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] text-slate-500 font-mono">
                                      {l.ts}
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/40 font-semibold">
                                      {l.node}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-200">
                                    {l.msg}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Performance */}
                    {activeTab === "performance" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                          <h3 className="text-sm font-semibold mb-3">
                            Throughput & Latency
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={efficiencySeries}>
                                <defs>
                                  <linearGradient
                                    id="tp"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#3b82f6"
                                      stopOpacity={0.35}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#3b82f6"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                  <linearGradient
                                    id="lt"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="5%"
                                      stopColor="#22c55e"
                                      stopOpacity={0.35}
                                    />
                                    <stop
                                      offset="95%"
                                      stopColor="#22c55e"
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#111827"
                                />
                                <XAxis
                                  dataKey="t"
                                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                                />
                                <YAxis
                                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #111827",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#e5e7eb",
                                  }}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="throughput"
                                  stroke="#3b82f6"
                                  fill="url(#tp)"
                                  strokeWidth={2}
                                />
                                <Area
                                  type="monotone"
                                  dataKey="latency"
                                  stroke="#22c55e"
                                  fill="url(#lt)"
                                  strokeWidth={2}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                          <h3 className="text-sm font-semibold mb-3">
                            Errors vs Cost
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#111827"
                                />
                                <XAxis
                                  dataKey="errors"
                                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                                />
                                <YAxis
                                  dataKey="cost"
                                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                                />
                                <Tooltip
                                  cursor={{ strokeDasharray: "3 3" }}
                                  contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #111827",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#e5e7eb",
                                  }}
                                />
                                <Scatter
                                  data={efficiencySeries}
                                  fill="#f59e0b"
                                />
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5 md:col-span-2">
                          <h3 className="text-sm font-semibold mb-3">
                            Resource Utilization
                          </h3>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={efficiencySeries}>
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="#111827"
                                />
                                <XAxis
                                  dataKey="t"
                                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                                />
                                <YAxis
                                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #111827",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#e5e7eb",
                                  }}
                                />
                                <Bar
                                  dataKey="cpu"
                                  stackId="a"
                                  fill="#3b82f6"
                                  radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                  dataKey="mem"
                                  stackId="a"
                                  fill="#22c55e"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Diagram */}
                    {activeTab === "diagram" && (
                      <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5 min-h-[420px]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold">
                            Current Data Pipeline Graph
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            Read-only
                          </span>
                        </div>
                        <div className="h-[360px] rounded-2xl bg-[#020617] border border-[#111827] overflow-hidden">
                          <WorkflowDiagram
                            nodes={graph.nodes}
                            edges={graph.edges}
                          />
                        </div>
                      </div>
                    )}

                    {/* Health */}
                    {activeTab === "health" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                          <h3 className="text-sm font-semibold mb-3">
                            Cluster Health
                          </h3>
                          <div className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={infraPie}
                                  dataKey="value"
                                  nameKey="name"
                                  innerRadius={50}
                                  outerRadius={80}
                                >
                                  {infraPie.map((e, i) => (
                                    <Cell key={i} fill={e.color} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #111827",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    color: "#e5e7eb",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-4 pt-3 border-t border-[#142842] flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-400">
                              Incidents (30d)
                            </span>
                            <span className="text-xs bg-red-500/15 text-red-300 border border-red-500/50 px-2 py-0.5 rounded-full font-semibold">
                              2
                            </span>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                          <h3 className="text-sm font-semibold mb-3">
                            Node Status
                          </h3>
                          <div className="space-y-2.5">
                            {[
                              ["DB Reader", "healthy", "emerald"],
                              ["API Fetcher", "warning", "amber"],
                              ["Aggregator", "healthy", "emerald"],
                              ["Notifier", "healthy", "emerald"],
                              ["Warehouse Sink", "healthy", "emerald"],
                            ].map(([name, status, color]) => {
                              const colorMap = {
                                emerald:
                                  "bg-emerald-500/15 text-emerald-300 border-emerald-500/50",
                                amber:
                                  "bg-amber-500/15 text-amber-300 border-amber-500/50",
                              };
                              return (
                                <div
                                  key={name}
                                  className="flex items-center justify-between rounded-xl bg-[#050815] border border-[#1c2744] px-3 py-2.5"
                                >
                                  <span className="text-sm text-slate-200">
                                    {name}
                                  </span>
                                  <span
                                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold capitalize border ${colorMap[color]}`}
                                  >
                                    {status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[#142842] bg-[#040a18] p-4 md:p-5">
                          <h3 className="text-sm font-semibold mb-3">
                            Infrastructure Metrics
                          </h3>
                          <div className="space-y-4">
                            <MetricBar
                              label="CPU Usage"
                              value={cpuUsage}
                              color="blue"
                            />
                            <MetricBar
                              label="Memory"
                              value={memUsage}
                              color="emerald"
                            />
                            <MetricBar
                              label="Disk"
                              value={diskUsage}
                              color="amber"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function MetricBar({ label, value, color }) {
  const colorMap = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-400">{label}</span>
        <span className="text-xs font-semibold text-slate-100">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#050815] overflow-hidden">
        <div
          className={`h-full rounded-full ${colorMap[color]} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ModernStatCard({
  label,
  value,
  unit,
  trend,
  trendUp,
  icon: Icon,
  color,
}) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/15 border-blue-500/40",
    emerald: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
    amber: "text-amber-300 bg-amber-500/15 border-amber-500/40",
  };

  const trendColor =
    trendUp === true
      ? "text-emerald-400"
      : trendUp === false
      ? "text-rose-400"
      : "text-slate-400";

  return (
    <div className="relative rounded-2xl border border-[#142842] bg-[#040a18] p-4 overflow-hidden shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between mb-2">
        <div
          className={`h-9 w-9 rounded-xl flex items-center justify-center border ${colorMap[color]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase mb-1">
        {label}
      </p>
      <div className="flex items-baseline gap-1 mb-1.5">
        <span className="text-2xl font-semibold text-slate-50">{value}</span>
        {unit && (
          <span className="text-xs text-slate-400 font-medium">{unit}</span>
        )}
      </div>
      {trend && (
        <p className={`text-[11px] font-medium ${trendColor}`}>{trend}</p>
      )}
    </div>
  );
}
