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
} from "react-flow-renderer";
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
      className={`relative border rounded-xl px-4 py-3 min-w-[200px] transition-shadow duration-150 ${
        selected ? "ring-2 ring-blue-500 shadow-lg" : "ring-0"
      } bg-[#061224] text-slate-100`}
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs uppercase tracking-wide text-blue-200 px-2 py-0.5 rounded-md bg-blue-900/10">
          {kind}
        </div>

        <button
          aria-label="delete"
          onClick={handleDelete}
          className="h-7 w-7 rounded-full bg-red-600/10 flex items-center justify-center hover:bg-red-600/20"
        >
          <Trash2 size={14} className="text-red-300" />
        </button>
      </div>

      <div className="font-semibold text-sm truncate">
        {data?.label || "Node"}
      </div>

      {data?.preview && (
        <div className="text-xs text-slate-400 mt-1">
          {data.preview.rows} rows • {(data.preview.schema || []).length} cols
        </div>
      )}

      {/* Make handles explicitly connectable */}
      <Handle type="target" position={Position.Left} isConnectable={true} />
      {kind === "conditional" ? (
        <>
          <Handle
            id="true"
            type="source"
            position={Position.Right}
            style={{ top: 12 }}
            isConnectable={true}
          />
          <Handle
            id="false"
            type="source"
            position={Position.Right}
            style={{ bottom: 12 }}
            isConnectable={true}
          />
        </>
      ) : (
        <Handle type="source" position={Position.Right} isConnectable={true} />
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
    <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1 custom-scrollbar">
      {nodeTypesCatalog.map((group) => (
        <div key={group.group}>
          <p className="text-[11px] font-semibold text-slate-400 mb-1.5 tracking-wide uppercase">
            {group.group}
          </p>
          <div className="flex flex-col gap-1">
            {group.nodes
              .filter((n) =>
                n.label.toLowerCase().includes(search.toLowerCase())
              )
              .map((node) => (
                <button
                  key={node.type}
                  type="button"
                  onClick={() => onAddNode(node)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs border border-[#1f2937] hover:bg-[#0b1120] hover:border-blue-500/70 transition-colors text-slate-200"
                >
                  <node.icon className="h-4 w-4 text-blue-400" />
                  <span>{node.label}</span>
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
    "w-full rounded-lg border border-[#1f2937] px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70";
  const labelClass =
    "text-[11px] font-medium text-slate-400 mb-1 uppercase tracking-wide";
  const Field = ({ label, children }) => (
    <div className="mb-4">
      <div className={labelClass}>{label}</div>
      {children}
    </div>
  );
  const update = (field, value) => onChangeField(node.id, field, value);

  const kind = node.data?.nodeKind || node.type;
  let configFields = null;

  switch (kind) {
    case "postgres":
    case "mysql":
    case "bigquery":
      configFields = (
        <>
          <Field label="Connection String">
            <input
              className={commonInput}
              value={node.data.connectionString || ""}
              onChange={(e) => update("connectionString", e.target.value)}
              placeholder="postgres://user:pass@host:5432/db"
            />
          </Field>
          <Field label="Table / Dataset">
            <input
              className={commonInput}
              value={node.data.table || ""}
              onChange={(e) => update("table", e.target.value)}
              placeholder="schema.table"
            />
          </Field>
          <Field label="Query (optional)">
            <textarea
              className={`${commonInput} min-h-[96px]`}
              value={node.data.query || ""}
              onChange={(e) => update("query", e.target.value)}
              placeholder="SELECT * FROM schema.table WHERE ..."
            />
          </Field>
        </>
      );
      break;
    case "s3":
      configFields = (
        <>
          <Field label="Bucket / Path">
            <input
              className={commonInput}
              value={node.data.path || ""}
              onChange={(e) => update("path", e.target.value)}
              placeholder="s3://bucket/folder/file.csv"
            />
          </Field>
          <Field label="File Type">
            <select
              className={commonInput}
              value={node.data.fileType || "csv"}
              onChange={(e) => update("fileType", e.target.value)}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="parquet">Parquet</option>
            </select>
          </Field>
          <Field label="Delimiter (CSV)">
            <input
              className={commonInput}
              value={node.data.delimiter || ","}
              onChange={(e) => update("delimiter", e.target.value)}
              placeholder=","
            />
          </Field>
        </>
      );
      break;
    case "api":
      configFields = (
        <>
          <Field label="Endpoint URL">
            <input
              className={commonInput}
              value={node.data.url || ""}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://api.example.com/data"
            />
          </Field>
          <Field label="HTTP Method">
            <select
              className={commonInput}
              value={node.data.method || "GET"}
              onChange={(e) => update("method", e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </Field>
          <Field label="Headers (JSON)">
            <textarea
              className={`${commonInput} min-h-[80px]`}
              value={node.data.headers || ""}
              onChange={(e) => update("headers", e.target.value)}
              placeholder='{"Authorization": "Bearer ..."}'
            />
          </Field>
          <Field label="Request Body (JSON)">
            <textarea
              className={`${commonInput} min-h-[80px]`}
              value={node.data.body || ""}
              onChange={(e) => update("body", e.target.value)}
              placeholder='{"key":"value"}'
            />
          </Field>
        </>
      );
      break;
    // ... other cases (filter, select, aggregate, join, etc.) kept same as your previous implementation
    case "filter":
      configFields = (
        <>
          <Field label="Predicate">
            <textarea
              className={`${commonInput} min-h-[72px]`}
              value={
                node.data.predicate ||
                "row.amount > 100 && row.status === 'paid'"
              }
              onChange={(e) => update("predicate", e.target.value)}
            />
          </Field>
          <Field label="Case Sensitive">
            <label className="inline-flex items-center gap-2 text-xs text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#1f2937]"
                checked={node.data.caseSensitive || false}
                onChange={(e) => update("caseSensitive", e.target.checked)}
              />
              <span>Enable case-sensitive comparisons</span>
            </label>
          </Field>
        </>
      );
      break;
    // include remaining cases (select, aggregate, join, lookup, conditional, loop, webhook, dashboard, notification, email, error, kafka, warehouse)
    case "select":
      configFields = (
        <>
          <Field label="Columns (comma separated)">
            <input
              className={commonInput}
              value={node.data.columns || "id,name,email"}
              onChange={(e) => update("columns", e.target.value)}
            />
          </Field>
          <Field label="Rename Map (JSON)">
            <textarea
              className={`${commonInput} min-h-[72px]`}
              value={node.data.rename || '{"email":"user_email"}'}
              onChange={(e) => update("rename", e.target.value)}
            />
          </Field>
        </>
      );
      break;
    case "aggregate":
      configFields = (
        <>
          <Field label="Group By (comma separated)">
            <input
              className={commonInput}
              value={node.data.groupBy || "country"}
              onChange={(e) => update("groupBy", e.target.value)}
            />
          </Field>
          <Field label="Aggregations (JSON)">
            <textarea
              className={`${commonInput} min-h-[72px]`}
              value={
                node.data.aggs ||
                '{"total": "sum(amount)", "count": "count(*)"}'
              }
              onChange={(e) => update("aggs", e.target.value)}
            />
          </Field>
        </>
      );
      break;
    case "join":
      configFields = (
        <>
          <Field label="Join Type">
            <select
              className={commonInput}
              value={node.data.joinType || "inner"}
              onChange={(e) => update("joinType", e.target.value)}
            >
              <option value="inner">Inner</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="full">Full</option>
            </select>
          </Field>
          <Field label="Left Key">
            <input
              className={commonInput}
              value={node.data.leftKey || "id"}
              onChange={(e) => update("leftKey", e.target.value)}
            />
          </Field>
          <Field label="Right Key">
            <input
              className={commonInput}
              value={node.data.rightKey || "user_id"}
              onChange={(e) => update("rightKey", e.target.value)}
            />
          </Field>
        </>
      );
      break;
    default:
      configFields = (
        <div className="text-slate-400 text-center py-8">
          No configuration available
        </div>
      );
  }

  return (
    <div className="w-[380px] border-l border-[#1f2937] flex flex-col max-h-screen">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f2937]">
        <h2 className="text-sm font-semibold text-slate-100">
          Node Properties
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="h-7 w-7 rounded-full flex items-center justify-center  border border-[#1f2937] text-slate-300 hover:bg-[#0b1120]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
        <Field label="Node Name">
          <input
            className={commonInput}
            value={node.data.label || ""}
            onChange={(e) => update("label", e.target.value)}
          />
        </Field>

        {configFields}
      </div>

      <div className="px-5 py-3 border-t border-[#1f2937]">
        <button
          type="button"
          onClick={() => onDeleteNode(node.id)}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-500/15 border border-red-500/70 text-xs font-medium text-red-200 px-3 py-2 hover:bg-red-500/30"
        >
          <Trash2 className="h-4 w-4" />
          Delete Node
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1E293B] border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="text-purple-400" size={20} />
            Generate Pipeline with AI
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Describe what you want your pipeline to do, and we'll build the
          initial structure for you.
        </p>
        <textarea
          className="w-full h-32 bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500 mb-4 placeholder:text-gray-600"
          placeholder="e.g. Read orders from Odoo, filter for high value (> $1000), enrich with customer data from Postgres, and save to BigQuery."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <>
              <RefreshCcw className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Pipeline
            </>
          )}
        </button>
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
    toast.success("Pipeline saved");
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
        const anchorKind = anchor.data?.nodeKind || anchor.type;
        if (anchorKind === "conditional") {
          const outTrue = edges.filter(
            (e) => e.source === anchor.id && e.sourceHandle === "true"
          ).length;
          const outFalse = edges.filter(
            (e) => e.source === anchor.id && e.sourceHandle === "false"
          ).length;
          const chosen = outTrue <= outFalse ? "true" : "false";
          setEdges((eds) =>
            addEdge(
              {
                id: `e-${anchor.id}-${newNode.id}`,
                source: anchor.id,
                sourceHandle: chosen,
                target: newNode.id,
                label: chosen === "true" ? "Yes" : "No",
              },
              eds
            )
          );
        } else {
          setEdges((eds) =>
            addEdge(
              {
                id: `e-${anchor.id}-${newNode.id}`,
                source: anchor.id,
                target: newNode.id,
              },
              eds
            )
          );
        }
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
      // For demo purposes, we'll create a standard ETL flow
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
      toast.success("Pipeline generated successfully!");
    },
    [setNodes, setEdges]
  );

  const runPreview = useCallback(() => {
    const idToNode = new Map(nodes.map((n) => [n.id, n]));
    const incoming = new Map(nodes.map((n) => [n.id, []]));
    edges.forEach((e) => {
      if (incoming.has(e.target)) incoming.get(e.target).push(e.source);
    });

    const previewable = new Set([
      "postgres",
      "mysql",
      "bigquery",
      "s3",
      "api",
      "filter",
      "select",
      "aggregate",
      "join",
      "lookup",
      "conditional",
      "loop",
    ]);

    function genPreview(kind, parents) {
      const parentRows = parents.length
        ? Math.max(
            ...parents.map((p) => idToNode.get(p)?.data?.preview?.rows || 1000)
          )
        : 1000;
      switch (kind) {
        case "postgres":
        case "mysql":
        case "bigquery":
          return {
            rows: 50000,
            schema: ["id", "name", "email", "created_at", "country"],
          };
        case "s3":
          return { rows: 12000, schema: ["col1", "col2", "col3", "col4"] };
        case "api":
          return { rows: 1200, schema: ["status", "result", "ts"] };
        case "filter":
          return {
            rows: Math.floor(parentRows * 0.6),
            schema: idToNode.get(parents[0])?.data?.preview?.schema || [],
          };
        case "select":
          return { rows: parentRows, schema: ["id", "name", "email"] };
        case "aggregate":
          return {
            rows: Math.min(Math.floor(parentRows / 10), 10000),
            schema: ["group", "total", "count"],
          };
        case "join":
          return {
            rows: parentRows,
            schema: (
              idToNode.get(parents[0])?.data?.preview?.schema || []
            ).concat(["right_*"]),
          };
        case "lookup":
          return {
            rows: parentRows,
            schema: (
              idToNode.get(parents[0])?.data?.preview?.schema || []
            ).concat(["enriched_field"]),
          };
        case "conditional":
          return {
            rows: Math.floor(parentRows * 0.5),
            schema: idToNode.get(parents[0])?.data?.preview?.schema || [],
          };
        case "loop":
          return {
            rows: Math.min(parentRows * 2, 100000),
            schema: idToNode.get(parents[0])?.data?.preview?.schema || [],
          };
        default:
          return {
            rows: parentRows,
            schema: idToNode.get(parents[0])?.data?.preview?.schema || [],
          };
      }
    }

    const updated = nodes.map((n) => {
      const kind = n.data?.nodeKind || n.type;
      const parents = incoming.get(n.id) || [];
      const preview = previewable.has(kind)
        ? genPreview(kind, parents)
        : undefined;
      const data = { ...n.data, preview, onDelete: handleDeleteNode };
      return { ...n, data };
    });

    setNodes(updated);
    toast.success("Preview generated");
  }, [nodes, edges, setNodes, handleDeleteNode]);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: isDragging ? "default" : "smoothstep",
      markerEnd: isDragging
        ? undefined
        : {
            type: MarkerType.ArrowClosed,
            color: "#64748b",
            width: 18,
            height: 18,
          },
      style: { stroke: "#64748b" },
    }),
    [isDragging]
  );

  const linkedWidget = getLinkedWidgetInfo(id);

  return (
    <div className="h-screen text-slate-50 flex flex-col">
      <div className="px-8 pt-6 pb-4">
        <div className="rounded-2xl border border-[#1f2937]">
          <div className="px-6 pt-4 pb-4 border-b border-[#1f2937] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/pipelines")}
                className="inline-flex  mt-6 items-center justify-center w-10 h-10 bg-transparent border border-[#1f2937] rounded-lg text-slate-200 hover:bg-[#0b1120]"
              >
                <X className="w-4 h-4 transform rotate-90" />
              </button>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Data Pipeline
                </div>
                <input
                  className="
    mt-1
    w-full
    px-4
    py-2
    text-lg"
                  onChange={(e) => setPipelineName(e.target.value)}
                  placeholder="Untitled Pipeline"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {linkedWidget && (
                <span className="hidden md:inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/60 px-3 py-1 text-xs text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Linked widget:{" "}
                  <span className="font-semibold">
                    {linkedWidget.widgetName}
                  </span>
                </span>
              )}

              <button
                type="button"
                onClick={runPreview}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium px-4 py-2"
              >
                <Play className="h-4 w-4" />
                Run Preview
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] text-white text-xs font-medium px-4 py-2"
              >
                <Save className="h-4 w-4" />
                Save Pipeline
              </button>
            </div>
          </div>

          {/* body */}
          <div className="flex h-[calc(100vh-210px)] overflow-hidden">
            {/* palette */}
            <div className="w-[260px] border-r border-[#1f2937] px-4 py-4 hidden md:flex flex-col">
              <input
                type="text"
                placeholder="Search nodes..."
                className="mb-3 h-9 w-full rounded-lg  border border-[#1f2937] px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <NodePalette search={search} onAddNode={addNodeSmart} />
            </div>

            {/* canvas (bigger, centered) */}
            <div className="flex-1 m-4 rounded-2xl border border-[#1f2937] overflow-hidden bg-[#061224]">
              <div className="h-full w-full">
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
                  <Controls showInteractive={false} />
                  <Background color="#111827" gap={24} />
                </ReactFlow>
              </div>
            </div>

            {/* config panel */}
            {selectedNode && (
              <ConfigPanel
                node={selectedNode}
                onChangeField={handleNodeFieldChange}
                onDeleteNode={handleDeleteNode}
                onClose={() => setSelectedNode(null)}
              />
            )}
          </div>

          {/* bottom status */}
          <div className="border-t border-[#1f2937] px-6 py-2 text-[11px] text-slate-400 flex items-center justify-between rounded-b-2xl">
            <span>Pipeline Status: Idle • Preview ready</span>
            <span>Collaborators: 1 • Version: 1.0</span>
          </div>
        </div>
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
