import { create } from "zustand"
import { temporal } from "zundo"
import { persist } from "zustand/middleware"
import { Edge, Node, MarkerType, Connection } from "@xyflow/react"
import { Table, Column, RelationType } from "@/interface"

interface DiagramState {
  tables: Table[]
  edges: Edge[]
  idCounter: number
}

interface DiagramActions {
  addTable: (table: Omit<Table, "id">) => string
  updateTableName: (id: string, name: string) => void
  updateTablePosition: (id: string, position: { x: number; y: number }) => void
  removeTable: (id: string) => void
  addColumn: (tableId: string, column: Column) => void
  updateColumn: (tableId: string, columnName: string, column: Column) => void
  removeColumn: (tableId: string, columnName: string) => void
  updateTableColumns: (tableId: string, columns: Column[]) => void
  addEdge: (connection: Connection, relationType: RelationType) => void
  removeEdge: (edgeId: string) => void
  clearDiagram: () => void
  loadDiagram: (tables: Table[], edges: Edge[]) => void
}

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
]

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "id-source",
    targetHandle: "user_id-target",
    animated: true,
    style: { stroke: "#94a3b8" },
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    data: { relationType: "one-to-many" as RelationType },
  },
]

export const useDiagramStore = create<DiagramState & DiagramActions>()(
  persist(
    temporal(
      (set, get) => ({
        tables: initialTables,
        edges: initialEdges,
        idCounter: 3,

        addTable: (table) => {
          const state = get()
          const id = `${state.idCounter}`
          set({
            tables: [
              ...state.tables,
              { ...table, id, position: table.position || { x: 0, y: 0 } },
            ],
            idCounter: state.idCounter + 1,
          })
          return id
        },

        updateTableName: (id, name) => {
          set({
            tables: get().tables.map((t) => (t.id === id ? { ...t, name } : t)),
          })
        },

        updateTablePosition: (id, position) => {
          set({
            tables: get().tables.map((t) =>
              t.id === id ? { ...t, position } : t
            ),
          })
        },

        removeTable: (id) => {
          const state = get()
          set({
            tables: state.tables.filter((t) => t.id !== id),
            edges: state.edges.filter(
              (e) => e.source !== id && e.target !== id
            ),
          })
        },

        addColumn: (tableId, column) => {
          set({
            tables: get().tables.map((t) =>
              t.id === tableId
                ? { ...t, columns: [...t.columns, column] }
                : t
            ),
          })
        },

        updateColumn: (tableId, columnName, column) => {
          set({
            tables: get().tables.map((t) =>
              t.id === tableId
                ? {
                    ...t,
                    columns: t.columns.map((c) =>
                      c.name === columnName ? column : c
                    ),
                  }
                : t
            ),
          })
        },

        removeColumn: (tableId, columnName) => {
          const state = get()
          set({
            tables: state.tables.map((t) =>
              t.id === tableId
                ? {
                    ...t,
                    columns: t.columns.filter((c) => c.name !== columnName),
                  }
                : t
            ),
            edges: state.edges.filter(
              (e) =>
                !(
                  (e.source === tableId &&
                    e.sourceHandle?.startsWith(columnName)) ||
                  (e.target === tableId &&
                    e.targetHandle?.startsWith(columnName))
                )
            ),
          })
        },

        updateTableColumns: (tableId, columns) => {
          set({
            tables: get().tables.map((t) =>
              t.id === tableId ? { ...t, columns } : t
            ),
          })
        },

        addEdge: (connection, relationType) => {
          const state = get()
          const id = `e${state.idCounter}`
          const newEdge: Edge = {
            id,
            source: connection.source || "",
            target: connection.target || "",
            sourceHandle: connection.sourceHandle || undefined,
            targetHandle: connection.targetHandle || undefined,
            animated: true,
            style: { stroke: "#94a3b8" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
            data: { relationType },
          }
          set({
            edges: [...state.edges, newEdge],
            idCounter: state.idCounter + 1,
          })
        },

        removeEdge: (edgeId) => {
          set({ edges: get().edges.filter((e) => e.id !== edgeId) })
        },

        clearDiagram: () => {
          set({ tables: [], edges: [], idCounter: 1 })
        },

        loadDiagram: (tables, edges) => {
          const maxId = Math.max(
            ...tables.map((t) => parseInt(t.id) || 0),
            ...edges.map((e) => parseInt(e.id.replace("e", "")) || 0),
            0
          )
          set({ tables, edges, idCounter: maxId + 1 })
        },
      }),
      {
        partialize: (state) => ({
          tables: state.tables,
          edges: state.edges,
          idCounter: state.idCounter,
        }),
        limit: 50,
      }
    ),
    {
      name: "db-diagram-storage",
      partialize: (state) => ({
        tables: state.tables,
        edges: state.edges,
        idCounter: state.idCounter,
      }),
    }
  )
)

// Typed temporal access helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storeAny = useDiagramStore as any
export const useUndo = () => storeAny.temporal.getState().undo as () => void
export const useRedo = () => storeAny.temporal.getState().redo as () => void
export const usePastStates = () =>
  storeAny.temporal.getState().pastStates as unknown[]
export const useFutureStates = () =>
  storeAny.temporal.getState().futureStates as unknown[]
