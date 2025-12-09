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
  Search,
  Filter,
  MoreVertical,
  Zap,
  Activity,
  Server,
  Database,
  Layers
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
  ScatterChart,
  Scatter,
} from "recharts";

// Helper functions
function getWorkflows() {
  return JSON.parse(localStorage.getItem("workflows") || "[]");
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ModernStatCard = ({ label, value, unit, trend, trendUp, icon: Icon, color }) => {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  const selectedColor = colorStyles[color] || colorStyles.blue;

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-300 shadow-sm">
      <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${selectedColor} transition-transform group-hover:scale-110 opacity-80`}>
        <Icon size={20} />
      </div>
      
      <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
      <div className="flex items-end gap-2 mb-2">
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {unit && <span className="text-slate-500 text-sm mb-1 font-medium">{unit}</span>}
      </div>
      
      {trend && (
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${
          trendUp === true ? "text-emerald-400" : 
          trendUp === false ? "text-rose-400" : "text-amber-400"
        }`}>
          {trendUp === true ? (
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-current" />
          ) : trendUp === false ? (
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-current" />
          ) : null}
          {trend}
        </div>
      )}
    </div>
  );
};

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
  
  const selectedWorkflow = filtered.find((wf) => wf.id === selectedId) || filtered[0];

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

  // Synthetic performance data generation
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

  const logsRaw = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        level: i % 11 === 0 ? "error" : i % 6 === 0 ? "warn" : i % 2 === 0 ? "info" : "debug",
        ts: new Date(Date.now() - i * 15 * 60_000).toLocaleString(),
        node: ["postgres", "filter", "select", "aggregate", "conditional", "kafka", "warehouse"][i % 7],
        msg: i % 11 === 0 ? `Error: timeout in node api-${(i % 3) + 1} after 30s (retry ${i % 3}).` : 
             i % 6 === 0 ? "Backoff retry succeeded for db-reader." : 
             i % 2 === 0 ? "Processed batch successfully." : "Fetched 500 rows from source.",
      })),
    []
  );

  const logs = logsRaw.filter((l) =>
    logFilter === "all" ? true : l.level === logFilter
  );

  const getIcon = (wfName) => {
    const name = (wfName || "").toLowerCase();
    if (name.includes('zoho')) return '🔄';
    if (name.includes('odoo')) return '📦';
    if (name.includes('sheets')) return '📊';
    if (name.includes('mqtt')) return '📡';
    if (name.includes('excel')) return '📁';
    if (name.includes('api')) return '🔌';
    return '⚡';
  };

  return (
    <div className="flex h-full bg-[#0f172a] text-slate-50 overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* Sidebar / List View - Softer Theme */}
      <aside className="w-[320px] flex-shrink-0 border-r border-slate-800 bg-[#111827] flex flex-col z-20 shadow-lg relative">
        {/* Sidebar Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">Data Pipelines</h1>
              <p className="text-xs text-slate-400 font-medium">Orchestrate your flows</p>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search pipelines..."
              className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900/50 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all hover:bg-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Pipeline List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2 custom-scrollbar pb-4">
          {filtered.map((wf) => {
            const isActive = selectedId === wf.id;
            return (
              <button
                key={wf.id}
                onClick={() => setSelectedId(wf.id)}
                className={`w-full text-left rounded-xl p-3 transition-all duration-200 border group relative overflow-hidden ${
                  isActive
                    ? "bg-slate-800 border-slate-700 shadow-md"
                    : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800/50"
                }`}
              >
                {isActive && (
                   <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-r-md" />
                )}
                
                <div className="flex items-start gap-3 pl-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 transition-colors ${
                    isActive ? "bg-slate-700 text-white" : "bg-slate-800/50 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-200"
                  }`}>
                    {getIcon(wf.name)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-sm font-semibold truncate pr-2 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {wf.name}
                      </h3>
                    </div>
                    
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                      {wf.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        wf.status === 'running' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-slate-700/50 text-slate-400 border-slate-700/50'
                      }`}>
                         {wf.status || 'IDLE'}
                      </span>
                      
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(wf.updatedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Create Button Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#111827]">
          <button
            onClick={() => navigate("/pipelines/create")}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold h-11 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <Plus size={18} />
            <span>New Pipeline</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Softer Theme */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative overflow-hidden">
        
        {!filtered.length ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
             <div className="h-20 w-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <FolderOpen size={40} className="text-slate-600" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">No pipelines found</h2>
             <p className="max-w-md mb-8 text-slate-500">Get started by creating your first data pipeline.</p>
             <button
               onClick={() => navigate("/pipelines/create")}
               className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg"
             >
               <Plus size={18} />
               Create Pipeline
             </button>
           </div>
        ) : (
          <>
            {/* Header */}
            <header className="flex-shrink-0 h-20 px-8 flex items-center justify-between border-b border-slate-800/60 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-6">
                <button
                   onClick={() => navigate(-1)} 
                   className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                >
                   <ArrowLeft size={20} />
                </button>
                <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shadow-sm border border-slate-700/50">
                  {getIcon(selectedWorkflow?.name)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                    {selectedWorkflow?.name}
                    <span className={`h-2.5 w-2.5 rounded-full ${selectedWorkflow?.status === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                  </h1>
                  <p className="text-sm text-slate-400 mt-1 max-w-xl truncate">
                     {selectedWorkflow?.description || "Automated data pipeline workflow"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <button
                    onClick={() => navigate(`/pipelines/edit/${selectedWorkflow.id}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-sm"
                  >
                    <Pencil size={16} />
                    Edit Pipeline
                  </button>
                  <button className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/50 transition-colors">
                    <MoreVertical size={18} />
                  </button>
              </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <ModernStatCard
                    label="Avg Throughput"
                    value={avgThroughput}
                    unit="events/min"
                    trend="12% vs baseline"
                    trendUp={true}
                    icon={Activity}
                    color="blue"
                  />
                  <ModernStatCard
                    label="p95 Latency"
                    value={p95Latency}
                    unit="ms"
                    trend="5% vs last run"
                    trendUp={false} // Latency down is good
                    icon={Clock}
                    color="emerald"
                  />
                  <ModernStatCard
                    label="Error Rate"
                    value={errorRate}
                    unit="%"
                    trend="Target < 0.5%"
                    trendUp={parseFloat(errorRate) < 0.5}
                    icon={AlertTriangle}
                    color="amber"
                  />
                  <ModernStatCard
                    label="Uptime SLA"
                    value="99.9%"
                    unit=""
                    trend="Last 30 days"
                    trendUp={true}
                    icon={CheckCircle2}
                    color="purple"
                  />
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Chart Section */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-700/40 bg-slate-800/40 p-6 backdrop-blur-sm shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                         <h3 className="text-base font-semibold text-white">Throughput & Latency</h3>
                         <p className="text-xs text-slate-500 mt-1">Real-time performance metrics over last {timeRange}</p>
                      </div>
                      <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                         <option value="24h">24h</option>
                         <option value="7d">7d</option>
                         <option value="30d">30d</option>
                      </select>
                    </div>
                    
                    <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={efficiencySeries}>
                             <defs>
                                <linearGradient id="colorTp" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorLt" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                             <XAxis dataKey="t" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                             <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontSize: '12px' }}
                             />
                             <Area type="monotone" dataKey="throughput" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTp)" />
                             <Area type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLt)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Logs / Activity Feed */}
                  <div className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-6 backdrop-blur-sm flex flex-col shadow-sm">
                     <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
                     <div className="space-y-4 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
                        {logs.slice(0, 10).map((log, i) => (
                           <div key={i} className="flex gap-3">
                              <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                 log.level === 'error' ? 'bg-red-500' :
                                 log.level === 'warn' ? 'bg-amber-500' :
                                 'bg-blue-500'
                              }`} />
                              <div>
                                 <p className="text-xs text-slate-300 leading-snug">{log.msg}</p>
                                 <span className="text-[10px] text-slate-500 mt-1 block">{log.ts} • {log.node}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                </div>

                {/* Pipeline Diagram Preview */}
                <div className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-6 backdrop-blur-sm shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-semibold text-white">Data Flow Diagram</h3>
                      <button 
                        onClick={() => navigate(`/pipelines/edit/${selectedWorkflow?.id}`)} 
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                         View Full Diagram
                      </button>
                   </div>
                   <div className="h-[200px] w-full rounded-xl bg-slate-900 border border-slate-800/50 overflow-hidden relative">
                      <WorkflowDiagram nodes={graph.nodes} edges={graph.edges} />
                   </div>
                </div>

              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
