import React, { memo, useState, useCallback } from "react"
import { Handle, Position, NodeProps } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Key, X } from "lucide-react"
import { Table, Column } from "@/interface"
import { EditTableDialog } from "./edit-table-dialog"
import { useDiagramStore } from "@/store/diagram-store"
import { useTranslations } from "next-intl"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomNode = memo(({ data, id }: NodeProps<any>) => {
  const table = data as Table
  const t = useTranslations("node")
  const [editOpen, setEditOpen] = useState(false)
  const updateTableName = useDiagramStore((s) => s.updateTableName)
  const removeTable = useDiagramStore((s) => s.removeTable)
  const updateTableColumns = useDiagramStore((s) => s.updateTableColumns)

  const handleDoubleClick = useCallback(() => {
    setEditOpen(true)
  }, [])

  const handleSave = useCallback(
    (name: string, columns: Column[]) => {
      updateTableName(id, name)
      updateTableColumns(id, columns)
    },
    [id, updateTableName, updateTableColumns]
  )

  const handleDelete = useCallback(() => {
    removeTable(id)
  }, [id, removeTable])

  return (
    <>
      <Card
        className="w-64 shadow-md border-border bg-card cursor-pointer hover:shadow-lg hover:border-muted-foreground/30 transition-all"
        onDoubleClick={handleDoubleClick}
      >
        <CardHeader className="p-3 pb-2 bg-muted border-b flex flex-row items-center justify-between space-y-0 rounded-t-lg">
          <CardTitle className="text-sm font-medium text-card-foreground">
            {table.name}
          </CardTitle>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 rounded hover:bg-destructive/10"
            title={t("deleteTable")}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border text-sm">
            {table.columns.map((column, index) => (
              <li
                key={index}
                className="relative px-3 py-2 flex items-center justify-between hover:bg-muted transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {column.isPrimary && (
                    <Key className="h-3 w-3 text-amber-500" />
                  )}
                  <span className="text-card-foreground">{column.name}</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-normal h-5 px-1.5 text-muted-foreground bg-muted hover:bg-muted/80"
                >
                  {column.type}
                </Badge>

                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${column.name}-target`}
                  className="w-2 h-2 !bg-muted-foreground/50 !border-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: -5 }}
                />
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${column.name}-source`}
                  className="w-2 h-2 !bg-muted-foreground/50 !border-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ right: -5 }}
                />
              </li>
            ))}
          </ul>
          {table.columns.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              {t("addColumnsHint")}
            </div>
          )}
        </CardContent>
      </Card>

      <EditTableDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        tableName={table.name}
        columns={table.columns}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  )
})

CustomNode.displayName = "CustomNode"
