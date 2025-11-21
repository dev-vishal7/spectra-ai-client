import React from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";

const defaultNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 50, y: 100 },
  },
  { id: "2", data: { label: "Fetch Data" }, position: { x: 250, y: 100 } },
  {
    id: "3",
    data: { label: "Send Notification" },
    position: { x: 450, y: 100 },
  },
];
const defaultEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

export default function WorkflowDiagram({
  nodes = defaultNodes,
  edges = defaultEdges,
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        background: "#f9fafb",
        borderRadius: 12,
        boxShadow: "0 2px 8px #e2e8f0",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <MiniMap />
        <Controls />
        <Background color="#e2e8f0" gap={16} />
      </ReactFlow>
    </div>
  );
}
