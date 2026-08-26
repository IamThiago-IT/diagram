import React, { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table as TableIcon,
  GripVertical,
  Search,
  Trash2,
  Focus,
  Link,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useDiagramStore } from "@/store/diagram-store"
import { useReactFlow } from "@xyflow/react"
import { RelationType } from "@/interface"

export function Sidebar() {
  const [search, setSearch] = useState("")
  const [tablesOpen, setTablesOpen] = useState(true)
  const [relationsOpen, setRelationsOpen] = useState(true)
  const tables = useDiagramStore((s) => s.tables)
  const edges = useDiagramStore((s) => s.edges)
  const removeTable = useDiagramStore((s) => s.removeTable)
  const { fitView, getNodes } = useReactFlow()

  const filteredTables = useMemo(() => {
    if (!search.trim()) return tables
    return tables.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [tables, search])

  const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const focusTable = (tableId: string) => {
    const nodes = getNodes()
    const node = nodes.find((n) => n.id === tableId)
    if (node) {
      fitView({
        padding: 0.5,
        duration: 300,
        nodes: [node],
      })
    }
  }

  const relationLabel: Record<RelationType, string> = {
    "one-to-one": "1:1",
    "one-to-many": "1:N",
    "many-to-many": "N:M",
  }

  const getTableName = (id: string) =>
    tables.find((t) => t.id === id)?.name || id

  return (
    <aside className="w-64 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tabela..."
            className="h-8 text-xs pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Draggable */}
        <div className="p-4 border-b">
          <p className="text-[10px] text-slate-500 font-medium mb-2 uppercase tracking-wider">
            Arrastar
          </p>
          <div
            className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-md cursor-grab active:cursor-grabbing hover:border-slate-300 transition-colors shadow-sm"
            onDragStart={(event) => handleDragStart(event, "table")}
            draggable
          >
            <GripVertical className="w-4 h-4 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                Nova Tabela
              </span>
              <span className="text-[10px] text-slate-500">
                Arraste para o canvas
              </span>
            </div>
          </div>
        </div>

        {/* Tables List */}
        <div className="border-b">
          <button
            onClick={() => setTablesOpen(!tablesOpen)}
            className="w-full flex items-center gap-2 p-4 pb-2 text-left"
          >
            {tablesOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
            <TableIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Tabelas
            </span>
            <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {tables.length}
            </span>
          </button>

          {tablesOpen && (
            <div className="px-4 pb-3 space-y-1">
              {filteredTables.length === 0 && (
                <p className="text-xs text-slate-400 py-2 text-center">
                  {tables.length === 0
                    ? "Nenhuma tabela criada"
                    : "Nenhuma tabela encontrada"}
                </p>
              )}
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 transition-colors group"
                >
                  <button
                    onClick={() => focusTable(table.id)}
                    className="flex items-center gap-2 flex-1 text-left min-w-0"
                  >
                    <Focus className="w-3 h-3 text-slate-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm text-slate-700 truncate">
                      {table.name}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {table.columns.length} col
                    </span>
                  </button>
                  <button
                    onClick={() => removeTable(table.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Relations */}
        <div className="border-b">
          <button
            onClick={() => setRelationsOpen(!relationsOpen)}
            className="w-full flex items-center gap-2 p-4 pb-2 text-left"
          >
            {relationsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
            <Link className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Relações
            </span>
            <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {edges.length}
            </span>
          </button>

          {relationsOpen && (
            <div className="px-4 pb-3 space-y-1">
              {edges.length === 0 && (
                <p className="text-xs text-slate-400 py-2 text-center">
                  Nenhuma relação criada
                </p>
              )}
              {edges.map((edge) => {
                const relType =
                  (edge.data?.relationType as RelationType) || "one-to-many"
                return (
                  <div
                    key={edge.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-slate-50 text-xs"
                  >
                    <span className="text-slate-700 font-medium truncate">
                      {getTableName(edge.source)}
                    </span>
                    <span className="text-slate-400 shrink-0">→</span>
                    <span className="text-slate-700 font-medium truncate">
                      {getTableName(edge.target)}
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                      {relationLabel[relType]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t bg-slate-50">
        <div className="text-[10px] text-slate-500 text-center leading-relaxed">
          Duplo-clique no nó para editar.
          <br />
          Conecte colunas arrastando entre handles.
        </div>
      </div>
    </aside>
  )
}
