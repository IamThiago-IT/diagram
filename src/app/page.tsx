"use client"

import type React from "react"

import { useState } from "react"
import { DatabaseTable } from "@/components/database-table"
import { TableRelation } from "@/components/table-relation"
import { AddTableDialog } from "@/components/add-table-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Define the Table and Relation types
interface Column {
  name: string
  type: string
  isPrimary: boolean
}

interface Table {
  id: string
  name: string
  position: { x: number; y: number }
  columns: Column[]
}

interface Relation {
  id: string
  sourceTableId: string
  targetTableId: string
  sourceColumn: string
  targetColumn: string
  relationType: "one-to-many" | "many-to-many" | "one-to-one"
}

export default function DiagramEditor() {
  const [tables, setTables] = useState<Table[]>([
    {
      id: "1",
      name: "Usuários",
      position: { x: 100, y: 100 },
      columns: [
        { name: "id", type: "integer", isPrimary: true },
        { name: "nome", type: "varchar", isPrimary: false },
        { name: "email", type: "varchar", isPrimary: false },
        { name: "criado_em", type: "timestamp", isPrimary: false },
      ],
    },
    {
      id: "2",
      name: "Pedidos",
      position: { x: 500, y: 100 },
      columns: [
        { name: "id", type: "integer", isPrimary: true },
        { name: "usuario_id", type: "integer", isPrimary: false },
        { name: "valor_total", type: "decimal", isPrimary: false },
        { name: "status", type: "varchar", isPrimary: false },
        { name: "criado_em", type: "timestamp", isPrimary: false },
      ],
    },
    {
      id: "3",
      name: "Produtos",
      position: { x: 300, y: 400 },
      columns: [
        { name: "id", type: "integer", isPrimary: true },
        { name: "nome", type: "varchar", isPrimary: false },
        { name: "preco", type: "decimal", isPrimary: false },
        { name: "estoque", type: "integer", isPrimary: false },
      ],
    },
  ])

  const [relations] = useState<Relation[]>([
    {
      id: "rel1",
      sourceTableId: "1",
      targetTableId: "2",
      sourceColumn: "id",
      targetColumn: "usuario_id",
      relationType: "one-to-many",
    },
    {
      id: "rel2",
      sourceTableId: "3",
      targetTableId: "2",
      sourceColumn: "id",
      targetColumn: "id",
      relationType: "many-to-many",
    },
  ])

  const [isAddTableOpen, setIsAddTableOpen] = useState(false)
  const [isDragging, setIsDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const handleDragStart = (e: React.MouseEvent<Element>, tableId: string) => {
    const table = tables.find((t) => t.id === tableId)
    if (!table) return

    const rect = e.currentTarget.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(tableId)
  }

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return

    setTables((prev) =>
      prev.map((table) => {
        if (table.id === isDragging) {
          return {
            ...table,
            position: {
              x: e.clientX - dragOffset.x,
              y: e.clientY - dragOffset.y,
            },
          }
        }
        return table
      }),
    )
  }

  const handleDragEnd = () => {
    setIsDragging(null)
  }

  const handleAddTable = (newTable: Omit<Table, "id" | "position">) => {
    const id = `table-${Date.now()}`
    setTables((prev) => [
      ...prev,
      {
        ...newTable,
        id,
        position: { x: 200, y: 200 },
      },
    ])
    setIsAddTableOpen(false)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 flex justify-between items-center bg-white">
        <h1 className="text-xl font-semibold">Diagrama de Banco de Dados</h1>
        <Button onClick={() => setIsAddTableOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nova Tabela
        </Button>
      </header>

      <div
        className="flex-1 relative bg-slate-50 overflow-auto"
        onMouseMove={isDragging ? handleDrag : undefined}
        onMouseUp={isDragging ? handleDragEnd : undefined}
        onMouseLeave={isDragging ? handleDragEnd : undefined}
      >
        <div className="absolute inset-0 min-w-full min-h-full">
          {/* Renderizar relações */}
          {relations.map((relation) => {
            const sourceTable = tables.find((t) => t.id === relation.sourceTableId)
            const targetTable = tables.find((t) => t.id === relation.targetTableId)

            if (!sourceTable || !targetTable) return null

            return (
              <TableRelation
                key={relation.id}
                relation={relation}
                sourcePosition={sourceTable.position}
                targetPosition={targetTable.position}
              />
            )
          })}

          {/* Renderizar tabelas */}
          {tables.map((table) => (
            <DatabaseTable key={table.id} table={table} onDragStart={(e) => handleDragStart(e, table.id)} />
          ))}
        </div>
      </div>

      <AddTableDialog open={isAddTableOpen} onOpenChange={setIsAddTableOpen} onAddTable={handleAddTable} />
    </div>
  )
}
