"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Key } from "lucide-react"
import { Column, SQL_TYPES, RelationType } from "@/interface"
import { useTranslations } from "next-intl"

interface EditTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tableName: string
  columns: Column[]
  onSave: (name: string, columns: Column[]) => void
  onDelete?: () => void
  onAddEdge?: (
    sourceCol: string,
    targetCol: string,
    relationType: RelationType
  ) => void
  availableColumns?: {
    tableId: string
    tableName: string
    columns: Column[]
  }[]
  sourceTableId?: string
}

export function EditTableDialog({
  open,
  onOpenChange,
  tableName: initialName,
  columns: initialColumns,
  onSave,
  onDelete,
}: EditTableDialogProps) {
  const t = useTranslations("dialog")
  const tCommon = useTranslations("common")
  const [name, setName] = useState(initialName)
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [newColName, setNewColName] = useState("")
  const [newColType, setNewColType] = useState<string>("varchar")

  useEffect(() => {
    if (open) {
      setName(initialName)
      setColumns([...initialColumns])
      setNewColName("")
      setNewColType("varchar")
    }
  }, [open, initialName, initialColumns])

  const handleSave = () => {
    onSave(name, columns)
    onOpenChange(false)
  }

  const addColumn = () => {
    if (!newColName.trim()) return
    if (columns.some((c) => c.name === newColName.trim())) return
    setColumns([
      ...columns,
      { name: newColName.trim(), type: newColType, isPrimary: false },
    ])
    setNewColName("")
  }

  const removeColumn = (colName: string) => {
    setColumns(columns.filter((c) => c.name !== colName))
  }

  const togglePrimary = (colName: string) => {
    setColumns(
      columns.map((c) =>
        c.name === colName ? { ...c, isPrimary: !c.isPrimary } : c
      )
    )
  }

  const updateColumnType = (colName: string, type: string) => {
    setColumns(columns.map((c) => (c.name === colName ? { ...c, type } : c)))
  }

  const updateColumnName = (oldName: string, newName: string) => {
    setColumns(
      columns.map((c) => (c.name === oldName ? { ...c, name: newName } : c))
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newColName.trim()) {
      addColumn()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editTable")}</DialogTitle>
          <DialogDescription>{t("editDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-name">{t("tableName")}</Label>
            <Input
              id="table-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("tableNamePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("columns")}</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {columns.map((col, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-muted rounded-md border border-border group"
                >
                  <button
                    onClick={() => togglePrimary(col.name)}
                    className="shrink-0"
                    title={t("togglePk")}
                  >
                    <Key
                      className={`h-4 w-4 transition-colors ${
                        col.isPrimary
                          ? "text-amber-500"
                          : "text-muted-foreground/40 hover:text-muted-foreground"
                      }`}
                    />
                  </button>

                  <Input
                    value={col.name}
                    onChange={(e) =>
                      updateColumnName(col.name, e.target.value)
                    }
                    className="h-7 text-xs flex-1"
                    placeholder={t("columnNamePlaceholder")}
                  />

                  <Select
                    value={col.type}
                    onValueChange={(val) => updateColumnType(col.name, val)}
                  >
                    <SelectTrigger className="w-[130px] h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SQL_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-xs"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <button
                    onClick={() => removeColumn(col.name)}
                    className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Input
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("newColumn")}
                className="h-7 text-xs"
              />
              <Select value={newColType} onValueChange={setNewColType}>
                <SelectTrigger className="w-[130px] h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SQL_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-xs">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={addColumn}
                disabled={!newColName.trim()}
                className="h-7 px-2 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete()
                onOpenChange(false)
              }}
              className="mr-auto"
            >
              {t("deleteTable")}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            {tCommon("cancel")}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!name.trim()}>
            {tCommon("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
