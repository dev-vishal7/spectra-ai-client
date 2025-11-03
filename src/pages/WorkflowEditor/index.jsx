import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Save,
  Play,
  Plus,
  Settings,
  Trash2,
  AlertCircle,
  CheckCircle,
  Database,
  Calculator,
  GitBranch,
  TrendingUp,
  Filter,
  Bell,
  Eye,
  Zap,
  XCircleIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  useReactFlow,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";

// Node type icons
const NODE_ICONS = {
  "data-source": Database,
  formula: Calculator,
  condition: GitBranch,
  aggregation: TrendingUp,
  filter: Filter,
  alert: Bell,
  output: Eye,
  transform: Zap,
};

const NODE_COLORS = {
  "data-source": {
    bg: "bg-green-500/20",
    border: "border-green-500",
    text: "text-green-400",
  },
  formula: {
    bg: "bg-blue-500/20",
    border: "border-blue-500",
    text: "text-blue-400",
  },
  condition: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500",
    text: "text-yellow-400",
  },
  aggregation: {
    bg: "bg-purple-500/20",
    border: "border-purple-500",
    text: "text-purple-400",
  },
  filter: {
    bg: "bg-orange-500/20",
    border: "border-orange-500",
    text: "text-orange-400",
  },
  alert: {
    bg: "bg-red-500/20",
    border: "border-red-500",
    text: "text-red-400",
  },
  output: {
    bg: "bg-cyan-500/20",
    border: "border-cyan-500",
    text: "text-cyan-400",
  },
  transform: {
    bg: "bg-pink-500/20",
    border: "border-pink-500",
    text: "text-pink-400",
  },
};

// Custom Node Component
// const CustomNode = ({ data }) => {
//   const Icon = NODE_ICONS[data.type];
//   const colors = NODE_COLORS[data.type];

//   return (
//     <div
//       onClick={data.onClick}
//       className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 min-w-[220px] cursor-pointer hover:shadow-xl transition-all backdrop-blur-sm`}
//     >
//       <div className="flex items-center gap-3 mb-2">
//         <Icon size={20} className={colors.text} />
//         <div className="flex-1">
//           <div className={`${colors.text} font-semibold text-sm`}>
//             {data.label}
//           </div>
//           <div className="text-xs text-slate-400">{data.type}</div>
//         </div>
//         {data.status === "configured" && (
//           <CheckCircle size={16} className="text-green-400" />
//         )}
//         {data.status === "not-configured" && (
//           <AlertCircle size={16} className="text-yellow-400" />
//         )}
//       </div>

//       {/* Show config preview */}
//       {data.config && (
//         <div className="text-xs text-slate-300 mt-2 space-y-1 bg-slate-900/50 p-2 rounded">
//           {data.type === "formula" && data.config.formula && (
//             <div className="font-mono">{data.config.formula}</div>
//           )}
//           {data.type === "data-source" && data.config.fields?.length > 0 && (
//             <div>Fields: {data.config.fields.join(", ")}</div>
//           )}
//           {data.type === "condition" && data.config.threshold && (
//             <div>Threshold: {data.config.threshold}</div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

const CustomNode = ({ data }) => {
  const Icon = NODE_ICONS[data.type] || BarChart2;
  const colors = NODE_COLORS[data.type] || NODE_COLORS["data-source"];

  return (
    <div className="relative">
      {/* === Target handle (incoming edge) === */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={true}
        style={{
          background: "#fff",
          border: "2px solid rgba(255,255,255,0.8)",
          width: 12,
          height: 12,
        }}
      />

      {/* === Node Card === */}
      <div
        onClick={data.onClick}
        className={`${colors.bg} ${colors.border} border-2 rounded-xl p-4 min-w-[220px] cursor-pointer hover:shadow-xl transition-all backdrop-blur-sm`}
      >
        <div className="flex items-center gap-3 mb-2">
          <Icon size={20} className={colors.text} />

          <div className="flex-1">
            <div className={`${colors.text} font-semibold text-sm`}>
              {data.label}
            </div>
            <div className="text-xs text-slate-400">{data.type}</div>
          </div>

          {data.status === "configured" && (
            <CheckCircle size={16} className="text-green-400" />
          )}
          {data.status === "not-configured" && (
            <AlertCircle size={16} className="text-yellow-400" />
          )}
        </div>

        {/* === Config Preview === */}
        {data.config && (
          <div className="text-xs text-slate-300 mt-2 space-y-1 bg-slate-900/50 p-2 rounded">
            {data.type === "formula" && data.config.formula && (
              <div className="font-mono">{data.config.formula}</div>
            )}
            {data.type === "data-source" && data.config.fields?.length > 0 && (
              <div>Fields: {data.config.fields.join(", ")}</div>
            )}
            {data.type === "condition" && data.config.threshold && (
              <div>Threshold: {data.config.threshold}</div>
            )}
          </div>
        )}
      </div>

      {/* === Source handle (outgoing edge) === */}
      {data.type !== "output" && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={true}
          style={{
            background: "#fff",
            border: "2px solid rgba(255,255,255,0.8)",
            width: 12,
            height: 12,
          }}
        />
      )}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

// Main Workflow Editor
const WorkflowEditor = ({
  widgetId,
  dashboardId,
  workflowId,
  onClose,
  onSave,
}) => {
  const [workflow, setWorkflow] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    loadWorkflow();
    loadSources();
  }, [workflowId, widgetId]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/dashboard/workflow/${widgetId}`);
      const workflowData = response.data.workflow;
      setWorkflow(workflowData);

      console.log("Loaded workflow:", workflowData);

      // Create nodes with proper data
      console.log("workflowData.nodes", workflowData.nodes);
      const flowNodes = workflowData.nodes.map((node) => ({
        id: node.nodeId,
        type: "custom",
        position: node.position || { x: 0, y: 0 },
        data: {
          ...node,
          onClick: () => {
            setIsConfigOpen(false);
            handleNodeClick(node);
          },
        },
      }));
      // Create edges with proper source and target
      const flowEdges = workflowData.edges.map((edge) => ({
        id: `edge-${edge.from}-${edge.to}`,
        source: edge.from,
        target: edge.to,
        label: edge.label || "data",
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "white",
          width: 20,
          height: 20,
        },
        style: { stroke: "white", strokeWidth: 2 },
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (error) {
      console.error("Load workflow error:", error);
      toast.error("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  };

  const loadSources = async () => {
    try {
      const response = await axios.get("/sources/get-sources");
      setSources(response.data || []);
    } catch (error) {
      console.error("Load sources error:", error);
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setIsConfigOpen(true);
  };

  const handleSaveNodeConfig = async (config) => {
    try {
      await axios.put(
        `/dashboard/workflow/${workflow._id}/node/${selectedNode.nodeId}`,
        { config }
      );

      await loadWorkflow(); // Reload to refresh UI
      setIsConfigOpen(false);
      toast.success("Node configuration saved");
    } catch (error) {
      console.error("Save node error:", error);
      toast.error("Failed to save node configuration");
    }
  };

  const handleAddNode = async (nodeType) => {
    try {
      const position = { x: 400, y: 300 };
      await axios.post(`/dashboard/workflow/${workflow._id}/node`, {
        nodeType,
        position,
      });

      await loadWorkflow();
      setIsAddNodeOpen(false);
      toast.success("Node added successfully");
    } catch (error) {
      console.error("Add node error:", error);
      toast.error("Failed to add node");
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!confirm("Are you sure you want to delete this node?")) return;

    try {
      await axios.delete(`/dashboard/workflow/${workflow._id}/node/${nodeId}`);
      await loadWorkflow();
      setIsConfigOpen(false);
      toast.success("Node deleted successfully");
    } catch (error) {
      console.error("Delete node error:", error);
      toast.error("Failed to delete node");
    }
  };

  const handleExecuteWorkflow = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/dashboard/workflow/${workflow._id}/execute`
      );
      setExecutionResult(response.data.result);
      toast.success("Workflow executed successfully");
    } catch (error) {
      console.error("Execute workflow error:", error);
      toast.error("Failed to execute workflow");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWorkflow = async () => {
    try {
      const updatedNodes = nodes.map((flowNode) => {
        const originalNode = workflow.nodes.find(
          (n) => n.nodeId === flowNode.id
        );
        return { ...originalNode, position: flowNode.position };
      });

      await axios.put(`/dashboard/workflow/${workflow._id}`, {
        nodes: updatedNodes,
        edges: workflow.edges,
      });

      toast.success("Workflow saved successfully");
      onSave?.();
    } catch (error) {
      console.error("Save workflow error:", error);
      toast.error("Failed to save workflow");
    }
  };

  const onConnect = useCallback(
    async (params) => {
      try {
        // Add edge to backend
        await axios.post(`/dashboard/workflow/${workflow._id}/connect`, {
          from: params.source,
          to: params.target,
          label: "data",
        });

        // Update local state
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              animated: true,
              type: "smoothstep",
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#64748b",
                width: 20,
                height: 20,
              },
              style: { stroke: "#64748b", strokeWidth: 2 },
            },
            eds
          )
        );

        toast.success("Connection added");
        await loadWorkflow(); // Reload to sync
      } catch (error) {
        console.error("Connect error:", error);
        toast.error("Failed to add connection");
      }
    },
    [workflow, setEdges]
  );

  const onEdgesDelete = useCallback(
    async (edgesToDelete) => {
      try {
        for (const edge of edgesToDelete) {
          await axios.post(`/dashboard/workflow/${workflow._id}/disconnect`, {
            from: edge.source,
            to: edge.target,
          });
        }
        toast.success("Connection removed");
        await loadWorkflow();
      } catch (error) {
        console.error("Disconnect error:", error);
        toast.error("Failed to remove connection");
      }
    },
    [workflow]
  );

  if (loading && !workflow) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              {workflow?.name || "Workflow Editor"}
            </h2>
            <p className="text-slate-400 text-sm">{workflow?.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddNodeOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Plus size={18} />
              Add Node
            </button>
            <button
              onClick={handleExecuteWorkflow}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Play size={18} />
              Test Run
            </button>
            <button
              onClick={handleSaveWorkflow}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <Save size={18} />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            nodeTypes={nodeTypes}
            // fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background color="#334155" gap={15} />
            <Controls />
          </ReactFlow>

          {/* Execution Result */}
          {executionResult && (
            <div className="absolute bottom-4 right-4 bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CheckCircle className="text-green-400" size={20} />
                  Execution Result
                </h3>
                <button
                  onClick={() => setExecutionResult(null)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
              <pre className="text-sm text-slate-300 bg-slate-900 p-4 rounded-lg overflow-auto max-h-60">
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Node Configuration Panel */}
        {isConfigOpen && selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            sources={sources}
            onSave={handleSaveNodeConfig}
            onClose={() => setIsConfigOpen(false)}
            onDelete={() => handleDeleteNode(selectedNode.nodeId)}
            workflow={workflow}
          />
        )}
      </div>

      {/* Add Node Modal */}
      {isAddNodeOpen && (
        <AddNodeModal
          onAdd={handleAddNode}
          onClose={() => setIsAddNodeOpen(false)}
        />
      )}
    </div>
  );
};

// Node Configuration Panel Component
const NodeConfigPanel = ({
  node,
  sources,
  onSave,
  onClose,
  onDelete,
  workflow,
}) => {
  const [config, setConfig] = useState(node.config || {});

  const handleSave = () => {
    onSave(config);
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case "data-source":
        return (
          <DataSourceConfig
            config={config}
            sources={sources}
            onChange={setConfig}
          />
        );
      case "formula":
        return <FormulaConfig config={config} onChange={setConfig} />;
      case "condition":
        return (
          <ConditionConfig
            config={config}
            onChange={setConfig}
            workflow={workflow}
          />
        );
      case "aggregation":
        return <AggregationConfig config={config} onChange={setConfig} />;
      case "filter":
        return (
          <FilterConfig
            config={config}
            onChange={setConfig}
            workflow={workflow}
          />
        );
      case "transform":
        return (
          <TransformConfig
            config={config}
            onChange={setConfig}
            workflow={workflow}
          />
        );
      case "alert":
        return <AlertConfig config={config} onChange={setConfig} />;
      case "output":
        return (
          <OutputConfig
            config={config}
            onChange={setConfig}
            workflow={workflow}
          />
        );
      default:
        return (
          <div className="text-slate-400 text-center py-8">
            No configuration available
          </div>
        );
    }
  };

  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 overflow-y-auto">
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">{node.label}</h3>
            <p className="text-slate-400 text-sm">{node.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-600/20 text-red-400 rounded-lg transition"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-700 rounded transition"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">{renderConfigFields()}</div>

      <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-4 flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Configuration Components
const DataSourceConfig = ({ config, sources, onChange }) => {
  const [selectedSource, setSelectedSource] = useState(config.sourceId || "");
  const [selectedFields, setSelectedFields] = useState(config.fields || []);
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    if (selectedSource) {
      loadSourceFields(selectedSource);
    }
  }, [selectedSource]);

  useEffect(() => {
    // Pre-fill if already configured
    if (config.sourceId && config.fields && config.fields.length > 0) {
      setSelectedSource(config.sourceId);
      setSelectedFields(config.fields);
    }
  }, [config]);

  const loadSourceFields = async (sourceId) => {
    try {
      const response = await axios.get(`/sources/latest-data/${sourceId}`);
      const data = response.data.data;
      if (data?.data?.parsed?.value) {
        const fields = Object.keys(data.data.parsed.value);
        setAvailableFields(fields);

        // Auto-select all fields if none selected
        if (selectedFields.length === 0) {
          setSelectedFields(fields);
          onChange({ ...config, sourceId: selectedSource, fields: fields });
        }
      }
    } catch (error) {
      console.error("Load fields error:", error);
    }
  };

  useEffect(() => {
    if (selectedSource && selectedFields.length > 0) {
      onChange({ ...config, sourceId: selectedSource, fields: selectedFields });
    }
  }, [selectedSource, selectedFields]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Data Source
        </label>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Select source...</option>
          {sources.map((source) => (
            <option key={source._id} value={source._id}>
              {source.name} ({source.protocol})
            </option>
          ))}
        </select>
      </div>

      {availableFields.length > 0 && (
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Select Fields
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableFields.map((field) => (
              <label
                key={field}
                className="flex items-center gap-2 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFields([...selectedFields, field]);
                    } else {
                      setSelectedFields(
                        selectedFields.filter((f) => f !== field)
                      );
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-white">{field}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Selected: {selectedFields.length} field(s)
          </div>
        </div>
      )}
    </div>
  );
};

const FormulaConfig = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Formula
        </label>
        <textarea
          value={config.formula || ""}
          onChange={(e) => onChange({ ...config, formula: e.target.value })}
          placeholder="(Availability * Performance * Quality) / 10000"
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Unit
          </label>
          <input
            type="text"
            value={config.unit || ""}
            onChange={(e) => onChange({ ...config, unit: e.target.value })}
            placeholder="%"
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Decimals
          </label>
          <input
            type="number"
            value={config.decimals || 2}
            onChange={(e) =>
              onChange({ ...config, decimals: parseInt(e.target.value) })
            }
            className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
          />
        </div>
      </div>
    </div>
  );
};

const ConditionConfig = ({ config, onChange, workflow }) => {
  const [availableFields, setAvailableFields] = useState([]);
  const [selectedField, setSelectedField] = useState(config.field || "");
  console.log("config", config);
  useEffect(() => {
    // Get fields from previous data-source node
    const inputNodes =
      workflow?.nodes.filter((n) => n.type === "data-source") || [];
    if (inputNodes.length > 0) {
      const fields = inputNodes[0].config?.fields || [];
      setAvailableFields(fields);
      if (!selectedField && fields.length > 0) {
        setSelectedField(fields[0]);
      }
    }
  }, [workflow]);

  useEffect(() => {
    if (selectedField) {
      onChange({ ...config, field: selectedField });
    }
  }, [selectedField]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Field
        </label>
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="">Select field...</option>
          {availableFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Condition
        </label>
        <select
          value={config.operator || ""}
          onChange={(e) => onChange({ ...config, operator: e.target.value })}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="">Select operator...</option>
          <option value=">">Greater than (&gt;)</option>
          <option value=">=">Greater than or equal (&gt;=)</option>
          <option value="<">Less than (&lt;)</option>
          <option value="<=">Less than or equal (&lt;=)</option>
          <option value="==">Equal to (==)</option>
          <option value="!=">Not equal to (!=)</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Value
        </label>
        <input
          type="number"
          value={config.threshold || 0}
          onChange={(e) =>
            onChange({ ...config, threshold: parseFloat(e.target.value) })
          }
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
          placeholder="Enter value..."
        />
      </div>

      <div className="p-3 bg-slate-900 rounded-lg">
        <div className="text-xs text-slate-400 mb-1">Preview:</div>
        <div className="text-sm text-white font-mono">
          {selectedField} {config.operator || ">"} {config.threshold || 0}
        </div>
      </div>
    </div>
  );
};

const AggregationConfig = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Operation
        </label>
        <select
          value={config.operation || ""}
          onChange={(e) => onChange({ ...config, operation: e.target.value })}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="">Select operation...</option>
          <option value="avg">Average</option>
          <option value="sum">Sum</option>
          <option value="min">Minimum</option>
          <option value="max">Maximum</option>
          <option value="count">Count</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Time Window
        </label>
        <select
          value={config.timeWindow || "1h"}
          onChange={(e) => onChange({ ...config, timeWindow: e.target.value })}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="1h">Last 1 hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>
    </div>
  );
};

const AlertConfig = ({ config, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Severity
        </label>
        <select
          value={config.severity || "info"}
          onChange={(e) => onChange({ ...config, severity: e.target.value })}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          value={config.message || ""}
          onChange={(e) => onChange({ ...config, message: e.target.value })}
          placeholder="Alert: Value is {{value}}"
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
          rows={3}
        />
      </div>
    </div>
  );
};

const FilterConfig = ({ config, onChange, workflow }) => {
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    const inputNodes =
      workflow?.nodes.filter((n) => n.type === "data-source") || [];
    if (inputNodes.length > 0) {
      setAvailableFields(inputNodes[0].config?.fields || []);
    }
  }, [workflow]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Filter Field
        </label>
        <select
          value={config.field || ""}
          onChange={(e) => onChange({ ...config, field: e.target.value })}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="">Select field...</option>
          {availableFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Operator
        </label>
        <select
          value={config.operator || ""}
          onChange={(e) => onChange({ ...config, operator: e.target.value })}
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="">Select operator...</option>
          <option value=">">Greater than</option>
          <option value="<">Less than</option>
          <option value=">=">Greater or equal</option>
          <option value="<=">Less or equal</option>
          <option value="==">Equal</option>
          <option value="!=">Not equal</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Value
        </label>
        <input
          type="number"
          value={config.value || ""}
          onChange={(e) =>
            onChange({ ...config, value: parseFloat(e.target.value) })
          }
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        />
      </div>
    </div>
  );
};

const TransformConfig = ({ config, onChange, workflow }) => {
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    const inputNodes =
      workflow?.nodes.filter((n) => n.type === "data-source") || [];
    if (inputNodes.length > 0) {
      setAvailableFields(inputNodes[0].config?.fields || []);
    }
  }, [workflow]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Transform Type
        </label>
        <select
          value={config.transformType || ""}
          onChange={(e) =>
            onChange({ ...config, transformType: e.target.value })
          }
          className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600"
        >
          <option value="">Select type...</option>
          <option value="select">Select Fields</option>
          <option value="rename">Rename Fields</option>
          <option value="convert">Convert Types</option>
        </select>
      </div>

      {config.transformType === "select" && (
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Select Fields to Keep
          </label>
          <div className="space-y-2">
            {availableFields.map((field) => (
              <label
                key={field}
                className="flex items-center gap-2 p-2 bg-slate-700 rounded hover:bg-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={(config.fields || []).includes(field)}
                  onChange={(e) => {
                    const fields = config.fields || [];
                    if (e.target.checked) {
                      onChange({ ...config, fields: [...fields, field] });
                    } else {
                      onChange({
                        ...config,
                        fields: fields.filter((f) => f !== field),
                      });
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-white">{field}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {config.transformType === "rename" && (
        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Rename Mapping
          </label>
          {availableFields.map((field) => (
            <div key={field} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={field}
                disabled
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600"
              />
              <span className="text-slate-400">→</span>
              <input
                type="text"
                value={(config.mapping || {})[field] || field}
                onChange={(e) =>
                  onChange({
                    ...config,
                    mapping: { ...config.mapping, [field]: e.target.value },
                  })
                }
                placeholder="New name"
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OutputConfig = ({ config, onChange, workflow }) => {
  const [availableFields, setAvailableFields] = useState([]);

  useEffect(() => {
    // Get all fields from workflow
    const dataNodes =
      workflow?.nodes.filter((n) => n.type === "data-source") || [];
    if (dataNodes.length > 0) {
      setAvailableFields(dataNodes[0].config?.fields || []);
    }
  }, [workflow]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-slate-300 text-sm font-medium mb-2">
          Output Fields
        </label>
        <p className="text-xs text-slate-400 mb-3">
          Select which fields to display in the widget
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableFields.map((field) => (
            <label
              key={field}
              className="flex items-center gap-2 p-2 bg-slate-700 rounded hover:bg-slate-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={(config.outputFields || []).includes(field)}
                onChange={(e) => {
                  const fields = config.outputFields || [];
                  if (e.target.checked) {
                    onChange({ ...config, outputFields: [...fields, field] });
                  } else {
                    onChange({
                      ...config,
                      outputFields: fields.filter((f) => f !== field),
                    });
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-white">{field}</span>
            </label>
          ))}
        </div>
        {(config.outputFields || []).length > 0 && (
          <div className="mt-2 p-2 bg-slate-900 rounded text-xs text-slate-300">
            Selected: {(config.outputFields || []).join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};

// Add Node Modal
const AddNodeModal = ({ onAdd, onClose }) => {
  const nodeTypes = [
    { type: "data-source", name: "Data Source", icon: Database },
    { type: "formula", name: "Formula", icon: Calculator },
    { type: "condition", name: "Condition", icon: GitBranch },
    { type: "aggregation", name: "Aggregation", icon: TrendingUp },
    { type: "filter", name: "Filter", icon: Filter },
    { type: "alert", name: "Alert", icon: Bell },
    { type: "transform", name: "Transform", icon: Zap },
    { type: "output", name: "Output", icon: Eye },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white text-xl font-semibold">Add Node</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {nodeTypes.map((node) => (
            <button
              key={node.type}
              onClick={() => onAdd(node.type)}
              className="flex flex-col items-center gap-3 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition border-2 border-transparent hover:border-blue-500"
            >
              <node.icon size={32} className="text-blue-400" />
              <span className="text-white font-medium">{node.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;
