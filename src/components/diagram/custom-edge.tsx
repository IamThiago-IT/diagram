import React from "react"
import {
  BaseEdge,
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
} from "@xyflow/react"
import { RelationType } from "@/interface"
import { X } from "lucide-react"
import { useDiagramStore } from "@/store/diagram-store"

function CrowFootEnd({ x, y, type }: { x: number; y: number; type: "source" | "target" }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="3" fill="#94a3b8" />
    </g>
  )
}

function OneEnd({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-3" y1="-6" x2="-3" y2="6" stroke="#94a3b8" strokeWidth="2" />
      <line x1="3" y1="-6" x2="3" y2="6" stroke="#94a3b8" strokeWidth="2" />
    </g>
  )
}

function ManyEnd({ x, y, rotation }: { x: number; y: number; rotation: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <line x1="0" y1="0" x2="-8" y2="-5" stroke="#94a3b8" strokeWidth="2" />
      <line x1="0" y1="0" x2="-8" y2="5" stroke="#94a3b8" strokeWidth="2" />
      <line x1="0" y1="0" x2="0" y2="-7" stroke="#94a3b8" strokeWidth="2" />
    </g>
  )
}

function getRelationSymbols(
  relationType: RelationType,
  side: "source" | "target"
): "one" | "many" {
  switch (relationType) {
    case "one-to-one":
      return "one"
    case "one-to-many":
      return side === "source" ? "one" : "many"
    case "many-to-many":
      return "many"
    default:
      return "one"
  }
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const relationType: RelationType =
    (data?.relationType as RelationType) || "one-to-many"
  const removeEdge = useDiagramStore((s) => s.removeEdge)

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const sourceSymbol = getRelationSymbols(relationType, "source")
  const targetSymbol = getRelationSymbols(relationType, "target")

  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI

  const labelMap: Record<RelationType, string> = {
    "one-to-one": "1 : 1",
    "one-to-many": "1 : N",
    "many-to-many": "N : M",
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: "#94a3b8", strokeWidth: 2 }} />

      {/* Source end notation */}
      {sourceSymbol === "one" ? (
        <OneEnd x={sourceX} y={sourceY} />
      ) : (
        <ManyEnd x={sourceX} y={sourceY} rotation={angle + 180} />
      )}

      {/* Target end notation */}
      {targetSymbol === "one" ? (
        <OneEnd x={targetX} y={targetY} />
      ) : (
        <ManyEnd x={targetX} y={targetY} rotation={angle} />
      )}

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-slate-500 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
              {labelMap[relationType]}
            </span>
            {selected && (
              <button
                onClick={() => removeEdge(id)}
                className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
