export interface Position {
  x: number
  y: number
}

export interface Column {
  name: string
  type: string
  isPrimary: boolean
}

export interface Table {
  id: string
  name: string
  position: Position
  columns: Column[]
}

export type RelationType = "one-to-one" | "one-to-many" | "many-to-many"

export interface Relation {
  id: string
  sourceTableId: string
  targetTableId: string
  sourceColumn: string
  targetColumn: string
  relationType: RelationType
}

export const SQL_TYPES = [
  "integer",
  "bigint",
  "smallint",
  "serial",
  "bigserial",
  "varchar",
  "char",
  "text",
  "boolean",
  "decimal",
  "numeric",
  "real",
  "double precision",
  "date",
  "time",
  "timestamp",
  "timestamptz",
  "uuid",
  "json",
  "jsonb",
  "bytea",
  "enum",
] as const

export type SqlType = (typeof SQL_TYPES)[number]
