"use client"

import type React from "react"

import type { Table as TableType } from "@/interface"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Key, GripVertical } from "lucide-react"

import { Table } from "@/interface"

interface DatabaseTableProps {
  table: TableType
  onDragStart: (e: React.MouseEvent<SVGSVGElement>) => void
}

export function DatabaseTable({ table, onDragStart }: DatabaseTableProps) {
  return (
    <Card
      className="absolute shadow-md w-64 cursor-move"
      style={{
        left: `${table.position.x}px`,
        top: `${table.position.y}px`,
      }}
    >
      <CardHeader className="p-3 pb-2 bg-slate-100 border-b flex flex-row items-center">
        <GripVertical className="h-4 w-4 mr-2 text-slate-500" onMouseDown={onDragStart} />
        <CardTitle className="text-sm font-medium">{table.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y text-sm">
          {table.columns.map((column, index) => (
            <li key={index} className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center">
                {column.isPrimary && <Key className="h-3 w-3 mr-2 text-amber-500" />}
                <span>{column.name}</span>
              </div>
              <Badge variant="outline" className="text-xs font-normal">
                {column.type}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
