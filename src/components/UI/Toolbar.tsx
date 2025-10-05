import React from 'react';
import { NodeType } from '../../types/canvas';
import { useCanvasStore } from '../../stores/canvasStore';

interface ToolbarProps {
  selectedNodeType: NodeType;
  onNodeTypeChange: (type: NodeType) => void;
  onExport: () => void;
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedNodeType,
  onNodeTypeChange,
  onExport,
  onClear,
}) => {
  const { nodes, connections } = useCanvasStore();

  const nodeTypes: { type: NodeType; label: string; color: string }[] = [
    { type: 'idea', label: 'Idea', color: '#DBEAFE' },
    { type: 'claim', label: 'Claim', color: '#FED7AA' },
    { type: 'evidence', label: 'Evidence', color: '#D1FAE5' },
    { type: 'question', label: 'Question', color: '#E9D5FF' },
    { type: 'outline', label: 'Outline', color: '#F3F4F6' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">Journey</h1>
        <div className="h-6 w-px bg-gray-300" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Node Type:</span>
          <div className="flex gap-2">
            {nodeTypes.map(({ type, label, color }) => (
              <button
                key={type}
                onClick={() => onNodeTypeChange(type)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  selectedNodeType === type
                    ? 'ring-2 ring-blue-500 ring-offset-1'
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                style={{
                  backgroundColor: color,
                  color: '#1F2937',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          {nodes.length} nodes · {connections.length} connections
        </div>
        <div className="h-6 w-px bg-gray-300" />
        <button
          onClick={onExport}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Export
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
};
