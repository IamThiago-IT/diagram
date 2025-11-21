import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table as TableIcon, Plus, GripVertical } from 'lucide-react';

export function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 border-r bg-white flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="font-semibold text-sm flex items-center gap-2">
                    <TableIcon className="w-4 h-4" />
                    Tables
                </h2>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">Draggable Items</p>
                        <div
                            className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md cursor-grab active:cursor-grabbing hover:border-slate-300 transition-colors shadow-sm"
                            onDragStart={(event) => onDragStart(event, 'table')}
                            draggable
                        >
                            <GripVertical className="w-4 h-4 text-slate-400" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-700">New Table</span>
                                <span className="text-xs text-slate-500">Drag to add</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-slate-50">
                <div className="text-xs text-slate-500 text-center">
                    Drag items to the canvas to build your schema.
                </div>
            </div>
        </aside>
    );
}
