import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key } from 'lucide-react';
import { Table } from '@/interface';

// We need to extend the NodeProps to include our data type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomNode = memo(({ data }: NodeProps<any>) => {
  // data will be of type TableNodeData (or similar, depending on how we pass it)
  // React Flow passes 'data' prop. We expect it to match our Table interface structure mostly.
  const table = data as Table;

  return (
    <Card className="w-64 shadow-md border-slate-200 bg-white">
      <CardHeader className="p-3 pb-2 bg-slate-50 border-b flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-slate-700">{table.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-slate-100 text-sm">
          {table.columns.map((column, index) => (
            <li key={index} className="relative px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-2">
                {column.isPrimary && <Key className="h-3 w-3 text-amber-500" />}
                <span className="text-slate-700">{column.name}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-normal h-5 px-1.5 text-slate-500 bg-slate-100 hover:bg-slate-200">
                {column.type}
              </Badge>

              {/* Handles for connecting relations */}
              <Handle
                type="target"
                position={Position.Left}
                id={`${column.name}-target`}
                className="w-2 h-2 !bg-slate-300 !border-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: -5 }}
              />
              <Handle
                type="source"
                position={Position.Right}
                id={`${column.name}-source`}
                className="w-2 h-2 !bg-slate-300 !border-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ right: -5 }}
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});

CustomNode.displayName = 'CustomNode';
