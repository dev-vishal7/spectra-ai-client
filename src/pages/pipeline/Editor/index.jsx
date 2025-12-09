// PipelineEditor.jsx
import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import {
  Play,
  Save,
  X,
  Trash2,
  Database,
  CloudDownload,
  FileText,
  GitBranch,
  RefreshCcw,
  Mail,
  Globe,
  Bell,
  TriangleAlert,
  Sparkles,
  ArrowLeft,
  Settings,
  MoreVertical,
  Check,
  Search,
  ChevronDown,
  Pencil
} from "lucide-react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Handle,
  Position,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

/* ---------- NODE CATALOG (static) ---------- */
const nodeTypesCatalog = [
  {
    group: "SOURCES",
    nodes: [
      { type: "postgres", label: "PostgreSQL", icon: Database },
      { type: "mysql", label: "MySQL", icon: Database },
      { type: "bigquery", label: "BigQuery", icon: Database },
      { type: "s3", label: "S3 / File", icon: FileText },
      { type: "api", label: "API Request", icon: CloudDownload },
    ],
  },
  {
    group: "TRANSFORM",
    nodes: [
      { type: "filter", label: "Filter Rows", icon: GitBranch },
      { type: "select", label: "Select Columns", icon: GitBranch },
      { type: "aggregate", label: "Aggregate", icon: GitBranch },
      { type: "join", label: "Join", icon: GitBranch },
      { type: "conditional", label: "Conditional", icon: GitBranch },
      { type: "loop", label: "Loop", icon: RefreshCcw },
    ],
  },
  {
    group: "ENRICH / OPS",
    nodes: [
      { type: "lookup", label: "Lookup / Enrich", icon: CloudDownload },
      { type: "error", label: "Error Handler", icon: TriangleAlert },
    ],
  },
  {
    group: "DESTINATIONS",
    nodes: [
      { type: "warehouse", label: "Data Warehouse", icon: Database },
      { type: "kafka", label: "Kafka Topic", icon: CloudDownload },
      { type: "dashboard", label: "Dashboard Widget", icon: FileText },
      { type: "notification", label: "Notification", icon: Bell },
      { type: "email", label: "Send Email", icon: Mail },
      { type: "webhook", label: "Webhook", icon: Globe },
    ],
  },
];

/* ---------- SMART NODE (memoized) ---------- */
const SmartNode = memo(({ id, data, selected }) => {
  const kind = data?.nodeKind || "node";
  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof data?.onDelete === "function") data.onDelete(id);
  };

  return (
    <div
      className={`relative border rounded-xl px-4 py-3 min-w-[220px] transition-all duration-200 shadow-sm ${
        selected 
          ? "ring-2 ring-blue-500/70 border-blue-500 bg-[#1e293b] shadow-blue-900/20" 
          : "border-slate-700 bg-[#1e293b]/90 hover:border-slate-600 hover:bg-[#334155]/80"
      }`}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
          selected ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-700/50 text-slate-400'
        }`}>
          {kind}
        </div>

        <button
          aria-label="delete"
          onClick={handleDelete}
          className="h-6 w-6 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-colors group"
        >
          <Trash2 size={12} className="text-slate-500 group-hover:text-red-400" />
        </button>
      </div>

      <div className="font-semibold text-sm truncate text-white mb-0.5">
        {data?.label || "Node"}
      </div>

      {data?.preview && (
        <div className="text-[10px] text-slate-400 font-mono">
          {data.preview.rows.toLocaleString()} rows • {(data.preview.schema || []).length} cols
        </div>
      )}

      {/* Make handles explicitly connectable */}
      <Handle type="target" position={Position.Left} isConnectable={true} className="!bg-slate-500 !w-3 !h-3 !border-2 !border-[#0f172a]" />
      {kind === "conditional" ? (
        <>
          <Handle
            id="true"
            type="source"
            position={Position.Right}
            style={{ top: 16 }}
            isConnectable={true}
            className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-[#0f172a]"
          />
          <Handle
            id="false"
            type="source"
            position={Position.Right}
            style={{ bottom: 16 }}
            isConnectable={true}
            className="!bg-rose-500 !w-3 !h-3 !border-2 !border-[#0f172a]"
          />
        </>
      ) : (
        <Handle type="source" position={Position.Right} isConnectable={true} className="!bg-blue-500 !w-3 !h-3 !border-2 !border-[#0f172a]" />
      )}
    </div>
  );
});

/* memoized nodeTypes object to avoid reactflow warnings */
const NODE_TYPES = { default: SmartNode };

/* ---------- localStorage helpers (unchanged) ---------- */
function getWorkflowGraph(id, isTemplate) {
  if (isTemplate) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    const t = templates.find((t) => t.id == id.replace("template-", ""));
    return t
      ? { nodes: t.nodes || [], edges: t.edges || [] }
      : { nodes: [], edges: [] };
  } else {
    const all = JSON.parse(localStorage.getItem("workflowGraphs") || "{}");
    return all[id] || { nodes: [], edges: [] };
  }
}
function saveWorkflowGraph(id, nodes, edges, isTemplate) {
  if (isTemplate) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    const idx = templates.findIndex((t) => t.id == id.replace("template-", ""));
    if (idx !== -1) {
      templates[idx].nodes = nodes;
      templates[idx].edges = edges;
      localStorage.setItem("templates", JSON.stringify(templates));
    }
  } else {
    const all = JSON.parse(localStorage.getItem("workflowGraphs") || "{}");
    all[id] = { nodes, edges };
    localStorage.setItem("workflowGraphs", JSON.stringify(all));
  }
}
function getLinkedWidgetInfo(workflowId) {
  try {
    const wtw = JSON.parse(localStorage.getItem("workflowToWidget") || "{}");
    return wtw[workflowId];
  } catch {
    return null;
  }
}
function getWorkflowMeta(id) {
  try {
    const workflows = JSON.parse(localStorage.getItem("workflows") || "[]");
    return workflows.find((w) => w.id == id) || null;
  } catch {
    return null;
  }
}
function upsertWorkflowMeta(id, updates) {
  try {
    const workflows = JSON.parse(localStorage.getItem("workflows") || "[]");
    const idx = workflows.findIndex((w) => w.id == id);
    const now = new Date().toISOString();
    if (idx === -1) {
      workflows.push({
        id,
        name: updates.name || "Untitled Pipeline",
        description: updates.description || "",
        status: updates.status || "IDLE",
        createdAt: now,
        updatedAt: now,
      });
    } else {
      workflows[idx] = {
        ...workflows[idx],
        ...updates,
        updatedAt: now,
      };
    }
    localStorage.setItem("workflows", JSON.stringify(workflows));
  } catch {
    // ignore
  }
}

/* ---------- Node Palette ---------- */
function NodePalette({ search, onAddNode }) {
  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar pb-6">
      {nodeTypesCatalog.map((group) => (
        <div key={group.group}>
          <p className="text-[10px] font-bold text-slate-500 mb-2.5 tracking-wider uppercase pl-1">
            {group.group}
          </p>
          <div className="flex flex-col gap-2">
            {group.nodes
              .filter((n) =>
                n.label.toLowerCase().includes(search.toLowerCase())
              )
              .map((node) => (
                <button
                  key={node.type}
                  type="button"
                  onClick={() => onAddNode(node)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-xs border border-slate-700/50 bg-slate-800/40 hover:bg-slate-700/60 hover:border-slate-600 transition-all text-slate-300 hover:text-white group hover:shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-700 transition-colors">
                     <node.icon className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <span className="font-medium">{node.label}</span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Config Panel (right) ---------- */
function ConfigPanel({ node, onChangeField, onDeleteNode, onClose }) {
  const commonInput =
    "w-full rounded-xl border border-slate-700/80 bg-slate-800/50 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all";
  const labelClass =
    "text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";
  
  const Field = ({ label, children }) => (
    <div className="mb-4">
      <div className={labelClass}>{label}</div>
      {children}
    </div>
  );

  const Section = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-2 mt-6 mb-3 pb-2 border-b border-slate-700/50">
      {Icon && <Icon size={12} className="text-blue-400" />}
      <h3 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{title}</h3>
    </div>
  );

  const update = (field, value) => onChangeField(node.id, field, value);

  const kind = node.data?.nodeKind || node.type;
  let configFields = null;

  // Mock schema for preview based on node type
  const mockSchema = kind.includes('api') 
    ? "{\n  \"id\": \"uuid\",\n  \"customer_email\": \"string\",\n  \"total_amount\": \"float\",\n  \"status\": \"string\"\n}"
    : "{\n  \"id\": \"integer\",\n  \"created_at\": \"timestamp\",\n  \"updated_at\": \"timestamp\",\n  \"is_active\": \"boolean\"\n}";

  switch (kind) {
    case "postgres":
    case "mysql":
    case "bigquery":
    case "warehouse":
      configFields = (
        <>
          <Section title="Connection Details" icon={Database} />
          <div className="grid grid-cols-2 gap-3">
             <Field label="Host">
                <input className={commonInput} value={node.data.host || ""} onChange={(e) => update("host", e.target.value)} placeholder="localhost" />
             </Field>
             <Field label="Port">
                <input className={commonInput} value={node.data.port || "5432"} onChange={(e) => update("port", e.target.value)} placeholder="5432" />
             </Field>
          </div>
          <Field label="Database Name">
             <input className={commonInput} value={node.data.database || ""} onChange={(e) => update("database", e.target.value)} placeholder="prod_db" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
             <Field label="Username">
                <input className={commonInput} value={node.data.user || ""} onChange={(e) => update("user", e.target.value)} placeholder="admin" />
             </Field>
             <Field label="Password">
                <input className={commonInput} type="password" value={node.data.password || ""} onChange={(e) => update("password", e.target.value)} placeholder="••••••" />
             </Field>
          </div>
          
          <Section title="Query / Table" icon={FileText} />
          <Field label="Source Table">
             <input className={commonInput} value={node.data.table || ""} onChange={(e) => update("table", e.target.value)} placeholder="public.users" />
          </Field>
          <Field label="Sync Mode">
             <select className={commonInput} value={node.data.syncMode || "full"} onChange={(e) => update("syncMode", e.target.value)}>
                <option value="full">Full Load (Overwrite)</option>
                <option value="incremental">Incremental (Append)</option>
                <option value="cdc">CDC (Change Data Capture)</option>
             </select>
          </Field>
          {node.data.syncMode === 'incremental' && (
             <Field label="Cursor Field">
                <input className={commonInput} value={node.data.cursor || "updated_at"} onChange={(e) => update("cursor", e.target.value)} />
             </Field>
          )}
        </>
      );
      break;

    case "s3":
      configFields = (
        <>
          <Section title="Bucket Configuration" icon={CloudDownload} />
          <Field label="Bucket Name">
            <input className={commonInput} value={node.data.bucket || ""} onChange={(e) => update("bucket", e.target.value)} placeholder="my-data-lake" />
          </Field>
          <Field label="Path Pattern">
             <input className={commonInput} value={node.data.path || ""} onChange={(e) => update("path", e.target.value)} placeholder="data/2024/*.csv" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
             <Field label="Region">
               <select className={commonInput} value={node.data.region || "us-east-1"} onChange={(e) => update("region", e.target.value)}>
                 <option value="us-east-1">us-east-1</option>
                 <option value="eu-west-1">eu-west-1</option>
                 <option value="ap-south-1">ap-south-1</option>
               </select>
             </Field>
             <Field label="Format">
               <select className={commonInput} value={node.data.fileType || "csv"} onChange={(e) => update("fileType", e.target.value)}>
                 <option value="csv">CSV</option>
                 <option value="json">JSON</option>
                 <option value="parquet">Parquet</option>
                 <option value="avro">Avro</option>
               </select>
             </Field>
          </div>
          
          <Section title="Access Credentials" icon={Settings} />
          <Field label="Access Key ID">
             <input className={commonInput} value={node.data.accessKey || ""} onChange={(e) => update("accessKey", e.target.value)} placeholder="AKIA..." />
          </Field>
          <Field label="Secret Access Key">
             <input className={commonInput} type="password" value={node.data.secretKey || ""} onChange={(e) => update("secretKey", e.target.value)} placeholder="••••••••" />
          </Field>
        </>
      );
      break;

    case "api":
      configFields = (
        <>
          <Section title="Request Settings" icon={Globe} />
           <div className="flex gap-2 mb-4">
             <div className="w-1/3">
               <Field label="Method">
                  <select className={commonInput} value={node.data.method || "GET"} onChange={(e) => update("method", e.target.value)}>
                     <option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option>
                  </select>
               </Field>
             </div>
             <div className="w-2/3">
               <Field label="Endpoint URL">
                  <input className={commonInput} value={node.data.url || ""} onChange={(e) => update("url", e.target.value)} placeholder="https://api.example.com/v1/..." />
               </Field>
             </div>
           </div>

           <Section title="Authentication" icon={Settings} />
           <Field label="Auth Type">
              <select className={commonInput} value={node.data.authType || "none"} onChange={(e) => update("authType", e.target.value)}>
                 <option value="none">None</option>
                 <option value="bearer">Bearer Token</option>
                 <option value="basic">Basic Auth</option>
                 <option value="apikey">API Key</option>
                 <option value="oauth2">OAuth 2.0</option>
              </select>
           </Field>
           {node.data.authType === 'bearer' && (
              <Field label="Token">
                 <input className={commonInput} type="password" value={node.data.authToken || ""} onChange={(e) => update("authToken", e.target.value)} placeholder="eyJ..." />
              </Field>
           )}
           {node.data.authType === 'apikey' && (
              <div className="grid grid-cols-2 gap-3">
                 <Field label="Key Name">
                    <input className={commonInput} value={node.data.keyName || "x-api-key"} onChange={(e) => update("keyName", e.target.value)} />
                 </Field>
                 <Field label="Value">
                    <input className={commonInput} type="password" value={node.data.keyValue || ""} onChange={(e) => update("keyValue", e.target.value)} />
                 </Field>
              </div>
           )}

           <Section title="Resilience & Paging" icon={RefreshCcw} />
           <div className="grid grid-cols-2 gap-3">
             <Field label="Timeout (ms)">
                <input className={commonInput} type="number" value={node.data.timeout || "5000"} onChange={(e) => update("timeout", e.target.value)} />
             </Field>
             <Field label="Retries">
                 <input className={commonInput} type="number" value={node.data.retries || "3"} onChange={(e) => update("retries", e.target.value)} />
             </Field>
           </div>
           <Field label="Pagination Strategy">
              <select className={commonInput} value={node.data.pagination || "none"} onChange={(e) => update("pagination", e.target.value)}>
                 <option value="none">No Pagination</option>
                 <option value="cursor">Cursor Based</option>
                 <option value="page">Page Number</option>
                 <option value="offset">Offset / Limit</option>
              </select>
           </Field>
        </>
      );
      break;

    case "kafka":
      configFields = (
        <>
          <Section title="Cluster Config" icon={Database} />
          <Field label="Bootstrap Servers">
             <input className={commonInput} value={node.data.servers || ""} onChange={(e) => update("servers", e.target.value)} placeholder="broker1:9092,broker2:9092" />
          </Field>
          <Field label="Topic">
             <input className={commonInput} value={node.data.topic || ""} onChange={(e) => update("topic", e.target.value)} placeholder="events.orders" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
             <Field label="Group ID">
                <input className={commonInput} value={node.data.groupId || ""} onChange={(e) => update("groupId", e.target.value)} placeholder="consumer-group-1" />
             </Field>
             <Field label="Offset Reset">
                <select className={commonInput} value={node.data.offset || "latest"} onChange={(e) => update("offset", e.target.value)}>
                   <option value="latest">Latest</option>
                   <option value="earliest">Earliest</option>
                </select>
             </Field>
          </div>
          
          <Section title="Schema Registry" icon={FileText} />
          <Field label="Registry URL">
             <input className={commonInput} value={node.data.registry || ""} onChange={(e) => update("registry", e.target.value)} placeholder="http://schema-registry:8081" />
          </Field>
        </>
      );
      break;

    case "filter":
      configFields = (
        <>
           <Section title="Filter Logic" icon={GitBranch} />
           <Field label="Condition (JavaScript)">
              <div className="relative">
                 <textarea 
                    className={`${commonInput} font-mono text-[11px] min-h-[120px]`}
                    value={node.data.predicate || "return row.status === 'active' && row.value > 100;"}
                    onChange={(e) => update("predicate", e.target.value)} 
                 />
                 <div className="absolute bottom-2 right-2 text-[10px] text-slate-500">JS Expression</div>
              </div>
           </Field>
           <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Check size={14} className="text-blue-400" />
              <span className="text-[10px] text-blue-200">Invalid rows will be dropped</span>
           </div>
        </>
      );
      break;

    default:
      configFields = (
         // Default generic fields if no specific match
         <>
             <Section title="General Config" icon={Settings} />
             <Field label="Description">
                 <textarea className={commonInput} value={node.data.description || ""} onChange={e => update("description", e.target.value)} rows={3} placeholder="Describe this step..." />
             </Field>
             <div className="text-slate-500 text-xs italic text-center py-4">
                Additional settings defined in code
             </div>
         </>
      );
  }

  return (
    <div className="w-[360px] border-l border-slate-800 bg-[#111827] flex flex-col h-full shadow-2xl relative z-10 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400">
             <Settings size={16} />
          </div>
          <div>
             <h2 className="text-sm font-bold text-white tracking-wide">Configuration</h2>
             <p className="text-[10px] text-slate-500 uppercase font-medium">{kind} Node</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
        <Field label="Node Name">
          <input
            className={`${commonInput} font-semibold text-blue-100`}
            value={node.data.label || ""}
            onChange={(e) => update("label", e.target.value)}
          />
        </Field>

        {configFields}
        
        {/* Model Preview */}
        <div className="mt-8 pt-6 border-t border-slate-800">
           <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                 <Database size={10} /> Detected Model
              </span>
              <span className="text-[10px] text-blue-400 cursor-pointer hover:text-blue-300 transition-colors flex items-center gap-1">
                 <RefreshCcw size={10} /> Refresh
              </span>
           </div>
           <div className="bg-[#0f172a] rounded-lg p-3 border border-slate-800 shadow-inner group relative">
              <pre className="text-[10px] font-mono text-slate-400 leading-relaxed overflow-x-auto pb-1 custom-scrollbar">
                 {mockSchema}
              </pre>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <span className="text-[10px] text-slate-600">JSON</span>
              </div>
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => onDeleteNode(node.id)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 px-4 py-3 hover:bg-red-500/20 hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-900/10 active:scale-[0.98]"
        >
          <Trash2 size={14} />
          Remove Node
        </button>
      </div>
    </div>
  );
}

/* ---------- AI Modal ---------- */
function AIModal({ isOpen, onClose, onGenerate }) {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    setGenerating(true);
    // Simulate AI delay
    setTimeout(() => {
      onGenerate(prompt);
      setGenerating(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#111827] border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="p-6 bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-b border-slate-700/60">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30">
                  <Sparkles className="text-purple-400 h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Generate Pipeline</h3>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors">
               <X size={18} />
             </button>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-slate-400 text-sm mb-4 leading-relaxed">
             Describe your data flow requirements in natural language, and our AI will continuously design the optimal pipeline structure for you.
          </p>
          <textarea
            className="w-full h-32 bg-[#0f172a] border border-slate-700/60 rounded-xl p-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 mb-5 placeholder:text-slate-600 resize-none"
            placeholder="e.g. Ingest customer orders from Shopify webhook, filter for orders above $500, join with CRM data for loyalty status, and sync to high-priority Slack channel."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20 active:scale-[0.98]"
          >
            {generating ? (
              <>
                <RefreshCcw className="animate-spin" size={18} />
                Generating Structure...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Auto-Generate Pipeline
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- MAIN EDITOR CONTENT ---------- */
function EditorContent({ id, isTemplate }) {
  const [search, setSearch] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pipelineName, setPipelineName] = useState("Untitled Pipeline");
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const { nodes: storedNodes, edges: storedEdges } = getWorkflowGraph(
        id,
        isTemplate
      );
      setNodes(storedNodes.length ? storedNodes : []);
      setEdges(storedEdges.length ? storedEdges : []);
      const meta = getWorkflowMeta(id);
      if (meta?.name) setPipelineName(meta.name);
    }
  }, [id, isTemplate, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const saveId = id || String(Date.now());
    saveWorkflowGraph(saveId, nodes, edges, isTemplate);
    upsertWorkflowMeta(saveId, { name: pipelineName, status: "IDLE" });
    toast.success("Pipeline saved successfully");
    navigate("/pipelines");
  }, [id, nodes, edges, isTemplate, pipelineName, navigate]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params }, eds)),
    [setEdges]
  );

  const handleNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);
  const handlePaneClick = () => setSelectedNode(null);

  const layoutGap = 220;
  const addNodeSmart = useCallback(
    (nodeType) => {
      const baseNodes = nodes;
      let anchor =
        selectedNode ||
        baseNodes.reduce(
          (acc, n) =>
            n.position?.x > (acc?.position?.x ?? -Infinity) ? n : acc,
          null
        );

      const newNode = {
        id: `${Date.now()}`,
        type: "default",
        position: anchor
          ? { x: anchor.position.x + layoutGap, y: anchor.position.y }
          : { x: 100, y: 160 },
        data: { label: nodeType.label, nodeKind: nodeType.type },
      };

      setNodes((nds) => nds.concat(newNode));

      if (anchor) {
        setEdges((eds) =>
          addEdge(
            {
              id: `e-${anchor.id}-${newNode.id}`,
              source: anchor.id,
              target: newNode.id,
              type: 'smoothstep'
            },
            eds
          )
        );
      }

      setSelectedNode(newNode);
    },
    [nodes, selectedNode, edges, setNodes, setEdges]
  );

  const handleDeleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      setSelectedNode((prev) => (prev?.id === nodeId ? null : prev));
    },
    [setNodes, setEdges]
  );

  const handleNodeFieldChange = useCallback(
    (nodeId, field, value) => {
      setNodes((nds) => {
        const updated = nds.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, [field]: value } } : n
        );
        setSelectedNode((prev) => {
          if (!prev) return prev;
          if (prev.id !== nodeId) return prev;
          return updated.find((x) => x.id === nodeId) || prev;
        });
        return updated;
      });
    },
    [setNodes, setSelectedNode]
  );

  const handleAIGenerate = useCallback(
    (prompt) => {
      // Mock generation logic based on prompt
      const newNodes = [
        {
          id: "1",
          type: "default",
          position: { x: 100, y: 100 },
          data: { label: "Odoo Orders", nodeKind: "api" },
        },
        {
          id: "2",
          type: "default",
          position: { x: 400, y: 100 },
          data: {
            label: "Filter High Value",
            nodeKind: "filter",
            predicate: "order.amount > 1000",
          },
        },
        {
          id: "3",
          type: "default",
          position: { x: 700, y: 100 },
          data: { label: "Enrich Customer", nodeKind: "lookup" },
        },
        {
          id: "4",
          type: "default",
          position: { x: 1000, y: 100 },
          data: { label: "BigQuery Warehouse", nodeKind: "bigquery" },
        },
      ];
      const newEdges = [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e3-4", source: "3", target: "4" },
      ];
      setNodes(newNodes);
      setEdges(newEdges);
      setPipelineName("AI Generated: High Value Orders");
      toast.success("Pipeline generated successfully");
    },
    [setNodes, setEdges]
  );

  const runPreview = useCallback(() => {
    // (Kept preview logic same as before, essentially)
    const idToNode = new Map(nodes.map((n) => [n.id, n]));
    const updated = nodes.map((n) => {
       return { ...n, data: { ...n.data, preview: { rows: Math.floor(Math.random() * 5000) + 100, schema: ['id', 'data'] }, onDelete: handleDeleteNode }};
    });
    setNodes(updated);
    toast.success("Preview generated successfully");
  }, [nodes, setNodes, handleDeleteNode]);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: isDragging ? "default" : "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#64748b",
        width: 14,
        height: 14,
      },
      style: { stroke: "#64748b", strokeWidth: 1.5 },
      animated: true,
    }),
    [isDragging]
  );

  const linkedWidget = getLinkedWidgetInfo(id);

  return (
    <div className="h-full bg-[#0f172a] text-slate-50 flex flex-col font-sans overflow-hidden">
      {/* HEADER - Softer Theme */}
      <header className="px-6 py-3 border-b border-slate-800 bg-[#0f172a]/95 backdrop-blur-md z-10 sticky top-0 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)} // Navigate back to previous page
                className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="h-8 w-[1px] bg-slate-700 mx-1" />

              <div className="group flex flex-col justify-center">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
                  Pipeline Editor
                </div>
                <div className="flex items-center gap-2">
                   <input
                    className="bg-transparent text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-1.5 -ml-1.5 w-64 transition-all placeholder:text-slate-600"
                    onChange={(e) => setPipelineName(e.target.value)}
                    value={pipelineName}
                    placeholder="Untitled Pipeline"
                  />
                  <Pencil className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {linkedWidget && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Linked: {linkedWidget.widgetName}</span>
                </div>
              )}
              
              <button 
                onClick={() => setIsAIModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-semibold border border-purple-600/20 transition-all hover:border-purple-600/40"
              >
                  <Sparkles size={14} />
                  <span>AI Gen</span>
              </button>

              <div className="h-6 w-[1px] bg-slate-800 mx-1" />

              <button
                type="button"
                onClick={runPreview}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] border border-slate-700/50 text-slate-200 text-xs font-semibold transition-all shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Run Preview
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md active:scale-[0.98]"
              >
                <Save className="h-3.5 w-3.5" />
                Save Pipeline
              </button>
            </div>
      </header>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Node Palette) - Softer Theme */}
        <aside className="w-[280px] bg-[#111827] border-r border-slate-800 flex flex-col">
           <div className="p-4 border-b border-slate-800">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Find nodes..."
                  className="w-full h-9 bg-slate-900 border border-slate-700/60 rounded-lg pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
           </div>
           
           <div className="flex-1 p-4 overflow-hidden">
             <NodePalette search={search} onAddNode={addNodeSmart} />
           </div>
           
           <div className="p-3 border-t border-slate-800 bg-slate-900/50 text-[10px] text-slate-500 text-center">
             Drag & Drop nodes to canvas
           </div>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#0f172a] overflow-hidden">
             
           {/* Canvas Container */}
           <div className="absolute inset-0 z-0">
             <ReactFlow
                nodes={nodes.map((n) => ({
                    ...n,
                    type: n.type || "default",
                    data: {
                        ...n.data,
                        onDelete: (nodeId) => handleDeleteNode(nodeId),
                        onClick: () => setSelectedNode(n),
                    },
                    className: "rf-node-transparent",
                }))}
                edges={edges}
                defaultEdgeOptions={defaultEdgeOptions}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onPaneClick={handlePaneClick}
                onNodeDragStart={() => setIsDragging(true)}
                onNodeDragStop={() => setIsDragging(false)}
                nodeTypes={NODE_TYPES}
                onNodeClick={(event, node) => setSelectedNode(node)}
                snapToGrid
                snapGrid={[20, 20]}
                panOnScroll
                zoomOnScroll
                panOnDrag
                fitView
                nodesDraggable
                nodesConnectable
                elementsSelectable
                proOptions={{ hideAttribution: true }}
                style={{ width: "100%", height: "100%" }}
            >
                <Controls className="!bg-slate-800 !border-slate-700/60 !shadow-lg [&>button]:!bg-slate-800 [&>button]:!border-slate-700/60 [&>button]:!fill-slate-400 hover:[&>button]:!bg-slate-700 hover:[&>button]:!fill-white" />
                <Background color="#334155" gap={20} size={1} />
            </ReactFlow>
           </div>
        </div>

        {/* Right Sidebar (Config Panel) */}
        {selectedNode && (
            <ConfigPanel
                node={selectedNode}
                onChangeField={handleNodeFieldChange}
                onDeleteNode={handleDeleteNode}
                onClose={() => setSelectedNode(null)}
            />
        )}
      </div>

      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}

/* ---------- WRAPPED EXPORT ---------- */
export default function PipelineEditor({ isTemplate }) {
  const { id } = useParams();
  return (
    <ReactFlowProvider>
      <EditorContent id={id} isTemplate={isTemplate} />
    </ReactFlowProvider>
  );
}
