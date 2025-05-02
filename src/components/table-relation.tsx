"use client"

import type { Relation, Position } from "@/interface"

export interface TableRelationProps {
  relation: Relation
  sourcePosition: Position
  targetPosition: Position
}

export function TableRelation({ relation, sourcePosition, targetPosition }: TableRelationProps) {
  // Calcular pontos de início e fim da linha
  const startX = sourcePosition.x + 128 // metade da largura da tabela
  const startY = sourcePosition.y + 40 // aproximadamente no meio do cabeçalho
  const endX = targetPosition.x + 128
  const endY = targetPosition.y + 40

  // Calcular pontos de controle para a curva
  const controlPointX = (startX + endX) / 2
  const controlPointY = (startY + endY) / 2 - 50

  // Criar o caminho SVG
  const path = `M ${startX},${startY} Q ${controlPointX},${controlPointY} ${endX},${endY}`

  // Determinar o estilo da linha com base no tipo de relação
  let strokeStyle = ""
  let markerEnd = ""

  switch (relation.relationType) {
    case "one-to-one":
      strokeStyle = "stroke-blue-500 stroke-2"
      markerEnd = "url(#arrowOne)"
      break
    case "one-to-many":
      strokeStyle = "stroke-green-500 stroke-2"
      markerEnd = "url(#arrowMany)"
      break
    case "many-to-many":
      strokeStyle = "stroke-purple-500 stroke-2 stroke-dasharray-2"
      markerEnd = "url(#arrowMany)"
      break
    default:
      strokeStyle = "stroke-gray-500 stroke-2"
      markerEnd = "url(#arrow)"
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none">
      <defs>
        {/* Marcador de seta para relações */}
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
        <marker
          id="arrowOne"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
        <marker
          id="arrowMany"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
      </defs>
      <path d={path} fill="none" className={strokeStyle} markerEnd={markerEnd} />
    </svg>
  )
}
