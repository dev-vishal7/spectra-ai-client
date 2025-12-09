import React, { memo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Database,
  CloudDownload,
  FileText,
  GitBranch,
  RefreshCcw,
  Mail,
  Globe,
  Bell,
  TriangleAlert,
  Archive,
  Layers,
  Activity
} from "lucide-react";

// Map node kinds to icons
const iconMap = {
  postgres: Database,
  mysql: Database,
  bigquery: Database,
  s3: Archive,
  api: CloudDownload,
  filter: GitBranch,
  select: Layers,
  aggregate: Activity,
  join: GitBranch,
  conditional: GitBranch,
  loop: RefreshCcw,
  lookup: CloudDownload,
  error: TriangleAlert,
  warehouse: Database,
  kafka: Activity,
  dashboard: FileText,
  notification: Bell,
  email: Mail,
  webhook: Globe,
};

const SmartNode = memo(({ data }) => {
  const kind = data?.nodeKind || "node";
  const Icon = iconMap[kind] || FileText;

  // Determine styling based on node type
  let accentColor = "blue";
  
  if (["filter", "conditional", "join", "select"].includes(kind)) {
     accentColor = "purple";
  } else if (["postgres", "mysql", "bigquery", "warehouse", "s3"].includes(kind)) {
     accentColor = "emerald";
  } else if (["notification", "email", "slack", "pagerduty"].includes(kind)) {
     accentColor = "amber";
  } else if (["api", "webhook"].includes(kind)) {
     accentColor = "cyan";
  }

  // Explicit color mapping for Tailwind to handle safely
  const colorMap = {
     purple: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
     emerald: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
     amber: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
     cyan: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
     blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20"
  };

  const badgeClass = `p-2 rounded-lg ring-1 ${colorMap[accentColor] || colorMap.blue}`;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800 shadow-xl min-w-[220px] hover:border-slate-600 transition-colors relative z-10">
      <div className={badgeClass}>
        <Icon size={18} strokeWidth={1.5} />
      </div>
      
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-bold text-slate-100 truncate pr-2">
          {data?.label || "Node"}
        </span>
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          {kind}
        </span>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-slate-800"
      />
      
      {kind === "conditional" ? (
        <>
          <Handle
            id="true"
            type="source"
            position={Position.Right}
            className="!w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-slate-800"
            style={{ top: '30%' }}
          />
          <Handle
            id="false"
            type="source"
            position={Position.Right}
            className="!w-2.5 !h-2.5 !bg-rose-500 !border-2 !border-slate-800"
            style={{ top: '70%' }}
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-slate-800"
        />
      )}
    </div>
  );
});

const nodeTypes = { default: SmartNode };

export default function WorkflowDiagram({ nodes = [], edges = [] }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#0f172a", // Match slate-900 background
      }}
    >
      {/* 
        This style block is CRITICAL. 
        It forces the default ReactFlow node wrapper to be transparent.
        Without this, you see a white box behind the custom dark node.
      */}
      <style>
        {`
          .react-flow__node-default {
            background: transparent !important;
            border: none !important;
            padding: 0 !important;
            width: auto !important;
            box-shadow: none !important;
          }
          .react-flow__node-default.selected, 
          .react-flow__node-default:focus,
          .react-flow__node-default:hover {
            box-shadow: none !important;
            background: transparent !important;
            border: none !important;
          }
        `}
      </style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={24} size={1} />
        <Controls 
          showInteractive={false} 
          className="!bg-slate-800 !border-slate-700 !shadow-none [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-400 hover:[&>button]:!text-white hover:[&>button]:!bg-slate-700" 
        />
      </ReactFlow>
    </div>
  );
}
