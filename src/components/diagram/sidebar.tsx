import React, { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
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
import { useTranslations } from "next-intl"

export function Sidebar() {
  const t = useTranslations("sidebar")
  const [search, setSearch] = useState("")
  const [tablesOpen, setTablesOpen] = useState(true)
  const [relationsOpen, setRelationsOpen] = useState(true)
  const tables = useDiagramStore((s) => s.tables)
  const edges = useDiagramStore((s) => s.edges)
  const removeTable = useDiagramStore((s) => s.removeTable)
  const { fitView, getNodes } = useReactFlow()

  const filteredTables = useMemo(() => {
    if (!search.trim()) return tables
    return tables.filter((tbl) =>
      tbl.name.toLowerCase().includes(search.toLowerCase())
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
    tables.find((tbl) => tbl.id === id)?.name || id

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="h-8 text-xs pl-8"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b">
          <p className="text-[10px] text-muted-foreground font-medium mb-2 uppercase tracking-wider">
            {t("drag")}
          </p>
          <div
            className="flex items-center gap-2 p-2.5 bg-muted border border-border rounded-md cursor-grab active:cursor-grabbing hover:border-muted-foreground/30 transition-colors shadow-sm"
            onDragStart={(event) => handleDragStart(event, "table")}
            draggable
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {t("newTable")}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t("dragInstruction")}
              </span>
            </div>
          </div>
        </div>

        <div className="border-b">
          <button
            onClick={() => setTablesOpen(!tablesOpen)}
            className="w-full flex items-center gap-2 p-4 pb-2 text-left"
          >
            {tablesOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <TableIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {t("tables")}
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {tables.length}
            </span>
          </button>

          {tablesOpen && (
            <div className="px-4 pb-3 space-y-1">
              {filteredTables.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  {tables.length === 0 ? t("noTables") : t("noTablesFound")}
                </p>
              )}
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors group"
                >
                  <button
                    onClick={() => focusTable(table.id)}
                    className="flex items-center gap-2 flex-1 text-left min-w-0"
                  >
                    <Focus className="w-3 h-3 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm text-foreground truncate">
                      {table.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {table.columns.length} {t("columns")}
                    </span>
                  </button>
                  <button
                    onClick={() => removeTable(table.id)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-b">
          <button
            onClick={() => setRelationsOpen(!relationsOpen)}
            className="w-full flex items-center gap-2 p-4 pb-2 text-left"
          >
            {relationsOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <Link className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              {t("relations")}
            </span>
            <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
              {edges.length}
            </span>
          </button>

          {relationsOpen && (
            <div className="px-4 pb-3 space-y-1">
              {edges.length === 0 && (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  {t("noRelations")}
                </p>
              )}
              {edges.map((edge) => {
                const relType =
                  (edge.data?.relationType as RelationType) || "one-to-many"
                return (
                  <div
                    key={edge.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted text-xs"
                  >
                    <span className="text-foreground font-medium truncate">
                      {getTableName(edge.source)}
                    </span>
                    <span className="text-muted-foreground shrink-0">
                      &rarr;
                    </span>
                    <span className="text-foreground font-medium truncate">
                      {getTableName(edge.target)}
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border border-border shrink-0">
                      {relationLabel[relType]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t bg-muted">
        <div className="text-[10px] text-muted-foreground text-center leading-relaxed">
          {t("helpEdit")}
          <br />
          {t("helpConnect")}
        </div>
      </div>
    </aside>
  )
}
