"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from "lucide-react"

interface Column {
  id: string
  name: string
  type: string
  isPrimary: boolean
}

interface Table {
  id: string
  name: string
  columns: Omit<Column, "id">[]
  position: { x: number; y: number }
}

interface AddTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTable: (table: Omit<Table, "id" | "position">) => void
}

export function AddTableDialog({ open, onOpenChange, onAddTable }: AddTableDialogProps) {
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<Omit<Column, "id">[]>([{ name: "id", type: "integer", isPrimary: true }])

  const handleAddColumn = () => {
    setColumns([...columns, { name: "", type: "varchar", isPrimary: false }])
  }

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const handleColumnChange = (index: number, field: keyof Omit<Column, "id">, value: string | boolean) => {
    setColumns(
      columns.map((column, i) => {
        if (i === index) {
          return { ...column, [field]: value }
        }
        return column
      }),
    )
  }

  const handleSubmit = () => {
    if (!tableName.trim()) return

    onAddTable({
      name: tableName,
      columns,
    })

    // Reset form
    setTableName("")
    setColumns([{ name: "id", type: "integer", isPrimary: true }])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Tabela</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="table-name">Nome da Tabela</Label>
            <Input
              id="table-name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Ex: Clientes"
            />
          </div>

          <div className="grid gap-2">
            <Label>Colunas</Label>
            {columns.map((column, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={column.name}
                  onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                  placeholder="Nome da coluna"
                  className="flex-1"
                />
                <Select value={column.type} onValueChange={(value) => handleColumnChange(index, "type", value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="integer">Integer</SelectItem>
                    <SelectItem value="varchar">Varchar</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="timestamp">Timestamp</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`primary-${index}`}
                    checked={column.isPrimary}
                    onCheckedChange={(checked) => handleColumnChange(index, "isPrimary", !!checked)}
                  />
                  <Label htmlFor={`primary-${index}`} className="text-xs">
                    PK
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveColumn(index)}
                  disabled={index === 0 && columns.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-2" onClick={handleAddColumn}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Coluna
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Adicionar Tabela</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
