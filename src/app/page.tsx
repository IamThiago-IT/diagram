"use client"

import React, { useCallback, useRef, useState, useEffect } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  Connection,
  Node,
  NodeChange,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  applyNodeChanges,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { toPng } from "html-to-image"
import {
  Undo2,
  Redo2,
  Download,
  Upload,
  Trash2,
  FileJson,
  FileCode,
  Image,
  ChevronDown,
} from "lucide-react"

import { Sidebar } from "@/components/diagram/sidebar"
import { CustomNode } from "@/components/diagram/custom-node"
import { CustomEdge } from "@/components/diagram/custom-edge"
import {
  useDiagramStore,
  useUndo,
  useRedo,
  usePastStates,
  useFutureStates,
} from "@/store/diagram-store"
import { Button } from "@/components/ui/button"

const nodeTypes: NodeTypes = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: CustomNode as any,
}

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
}

function HeaderControls() {
  const [exportOpen, setExportOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const undo = useUndo()
  const redo = useRedo()
  const pastStates = usePastStates()
  const futureStates = useFutureStates()
  const clearDiagram = useDiagramStore((s) => s.clearDiagram)
  const loadDiagram = useDiagramStore((s) => s.loadDiagram)
  const tables = useDiagramStore((s) => s.tables)
  const edges = useDiagramStore((s) => s.edges)

  const canUndo = pastStates.length > 0
  const canRedo = futureStates.length > 0

  const exportPNG = useCallback(() => {
    const el = document.querySelector(".react-flow") as HTMLElement
    if (!el) return
    toPng(el, { backgroundColor: "#f8fafc", quality: 1 }).then((dataUrl) => {
      const link = document.createElement("a")
      link.download = "diagram.png"
      link.href = dataUrl
      link.click()
    })
    setExportOpen(false)
  }, [])

  const exportJSON = useCallback(() => {
    const data = JSON.stringify({ tables, edges }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = "diagram.json"
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }, [tables, edges])

  const exportSQL = useCallback(() => {
    let sql = ""
    for (const table of tables) {
      const colDefs = table.columns
        .map((col) => {
          const pk = col.isPrimary ? " PRIMARY KEY" : ""
          return `  ${col.name} ${col.type.toUpperCase()}${pk}`
        })
        .join(",\n")
      sql += `CREATE TABLE ${table.name} (\n${colDefs}\n);\n\n`
    }
    for (const edge of edges) {
      const src = tables.find((t) => t.id === edge.source)
      const tgt = tables.find((t) => t.id === edge.target)
      if (!src || !tgt) continue
      const tgtCol = edge.targetHandle?.replace("-target", "") || "id"
      const srcCol = edge.sourceHandle?.replace("-source", "") || "id"
      sql += `ALTER TABLE ${tgt.name} ADD CONSTRAINT fk_${tgt.name}_${srcCol} FOREIGN KEY (${tgtCol}) REFERENCES ${src.name}(${srcCol});\n\n`
    }
    const blob = new Blob([sql], { type: "text/sql" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = "diagram.sql"
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    setExportOpen(false)
  }, [tables, edges])

  const importJSON = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (data.tables && data.edges) {
            loadDiagram(data.tables, data.edges)
          }
        } catch {
          alert("Arquivo JSON invalido")
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [loadDiagram])

  const handleClear = useCallback(() => {
    clearDiagram()
    setConfirmClear(false)
  }, [clearDiagram])

  useEffect(() => {
    if (!confirmClear) return
    const timer = setTimeout(() => setConfirmClear(false), 3000)
    return () => clearTimeout(timer)
  }, [confirmClear])

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => undo()}
        disabled={!canUndo}
        title="Desfazer (Ctrl+Z)"
        className="h-8 w-8"
      >
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => redo()}
        disabled={!canRedo}
        title="Refazer (Ctrl+Y)"
        className="h-8 w-8"
      >
        <Redo2 className="h-4 w-4" />
      </Button>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setExportOpen(!exportOpen)}
          className="h-8 gap-1.5 text-xs"
        >
          <Download className="h-3.5 w-3.5" />
          Exportar
          <ChevronDown className="h-3 w-3" />
        </Button>
        {exportOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setExportOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[160px]">
              <button
                onClick={exportJSON}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileJson className="h-4 w-4 text-slate-400" />
                JSON
              </button>
              <button
                onClick={exportSQL}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileCode className="h-4 w-4 text-slate-400" />
                SQL DDL
              </button>
              <button
                onClick={exportPNG}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Image className="h-4 w-4 text-slate-400" />
                PNG
              </button>
            </div>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={importJSON}
        className="h-8 gap-1.5 text-xs"
      >
        <Upload className="h-3.5 w-3.5" />
        Importar
      </Button>

      <div className="w-px h-5 bg-slate-200 mx-1" />

      {confirmClear ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleClear}
          className="h-8 gap-1.5 text-xs"
        >
          Confirmar limpar?
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirmClear(true)}
          className="h-8 gap-1.5 text-xs text-slate-500 hover:text-red-500"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}

function DiagramFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const tables = useDiagramStore((s) => s.tables)
  const edges = useDiagramStore((s) => s.edges)
  const addTable = useDiagramStore((s) => s.addTable)
  const addEdgeToStore = useDiagramStore((s) => s.addEdge)
  const removeTable = useDiagramStore((s) => s.removeTable)
  const removeEdge = useDiagramStore((s) => s.removeEdge)
  const updateTablePosition = useDiagramStore((s) => s.updateTablePosition)
  const undo = useUndo()
  const redo = useRedo()

  const [nodes, setNodes] = React.useState<Node[]>([])

  React.useEffect(() => {
    setNodes(
      tables.map((table) => ({
        id: table.id,
        type: "table" as const,
        position: table.position,
        data: { ...table } as unknown as Record<string, unknown>,
      }))
    )
  }, [tables])

  const styledEdges = React.useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        type: "custom" as const,
        animated: true,
        style: { stroke: "#94a3b8" },
        markerEnd: undefined,
      })),
    [edges]
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds))
      for (const change of changes) {
        if (change.type === "position" && change.position && !change.dragging) {
          updateTablePosition(change.id, change.position)
        }
        if (change.type === "remove") {
          removeTable(change.id)
        }
      }
    },
    [updateTablePosition, removeTable]
  )

  const onConnect = useCallback(
    (params: Connection) => {
      addEdgeToStore(params, "one-to-many")
    },
    [addEdgeToStore]
  )

  const onEdgesDelete = useCallback(
    (deletedEdges: { id: string }[]) => {
      for (const edge of deletedEdges) {
        removeEdge(edge.id)
      }
    },
    [removeEdge]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData("application/reactflow")
      if (typeof type === "undefined" || !type) return

      const wrapper = reactFlowWrapper.current
      if (!wrapper) return

      const bounds = wrapper.getBoundingClientRect()
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }

      addTable({
        name: "Nova Tabela",
        position,
        columns: [
          { name: "id", type: "integer", isPrimary: true },
          { name: "created_at", type: "timestamp", isPrimary: false },
        ],
      })
    },
    [addTable]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="h-14 border-b bg-white px-4 flex items-center justify-between z-10 relative shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="font-semibold text-slate-800">DB Diagram</h1>
        </div>
        <HeaderControls />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={() => {}}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-slate-50"
            deleteKeyCode={["Delete", "Backspace"]}
          >
            <Background color="#e2e8f0" gap={16} />
            <Controls className="bg-white border-slate-200 shadow-sm text-slate-600" />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default function DiagramPage() {
  return (
    <ReactFlowProvider>
      <DiagramFlow />
    </ReactFlowProvider>
  )
}
