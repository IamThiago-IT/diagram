"use client"

import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  MarkerType,
  NodeTypes,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Sidebar } from '@/components/diagram/sidebar';
import { CustomNode } from '@/components/diagram/custom-node';
import { Table } from '@/interface';

const nodeTypes: NodeTypes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: CustomNode as any,
};

const initialTables: Table[] = [
  {
    id: "1",
    name: "Users",
    position: { x: 100, y: 100 },
    columns: [
      { name: "id", type: "integer", isPrimary: true },
      { name: "name", type: "varchar", isPrimary: false },
      { name: "email", type: "varchar", isPrimary: false },
      { name: "created_at", type: "timestamp", isPrimary: false },
    ],
  },
  {
    id: "2",
    name: "Orders",
    position: { x: 500, y: 100 },
    columns: [
      { name: "id", type: "integer", isPrimary: true },
      { name: "user_id", type: "integer", isPrimary: false },
      { name: "total", type: "decimal", isPrimary: false },
      { name: "status", type: "varchar", isPrimary: false },
      { name: "created_at", type: "timestamp", isPrimary: false },
    ],
  },
];

const initialNodes: Node[] = initialTables.map((table) => ({
  id: table.id,
  type: 'table',
  position: table.position,
  data: table as unknown as Record<string, unknown>,
}));

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'id-source',
    targetHandle: 'user_id-target',
    animated: true,
    style: { stroke: '#94a3b8' },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#94a3b8',
    },
  },
];

let id = 3;
const getId = () => `${id++}`;

function DiagramFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: '#94a3b8' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }
    }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newId = getId();
      const newNode: Node = {
        id: newId,
        type,
        position,
        data: {
          id: newId,
          name: `New Table ${newId}`,
          position: { x: 0, y: 0 }, // Position is handled by React Flow node position
          columns: [
            { name: "id", type: "integer", isPrimary: true },
            { name: "created_at", type: "timestamp", isPrimary: false }
          ]
        } as unknown as Record<string, unknown>,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="h-14 border-b bg-white px-4 flex items-center justify-between z-10 relative shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="font-semibold text-slate-800">DB Diagram</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Future controls */}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50"
          >
            <Background color="#e2e8f0" gap={16} />
            <Controls className="bg-white border-slate-200 shadow-sm text-slate-600" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function DiagramPage() {
  return (
    <ReactFlowProvider>
      <DiagramFlow />
    </ReactFlowProvider>
  );
}
