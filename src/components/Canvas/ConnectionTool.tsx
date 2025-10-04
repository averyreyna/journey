import React, { useState } from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import { ConnectionType } from '../../types/canvas';

export const ConnectionTool: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedType, setSelectedType] = useState<ConnectionType>('general');
  const { nodes, addConnection } = useCanvasStore();

  const connectionTypes: { type: ConnectionType; label: string; color: string }[] = [
    { type: 'general', label: 'General', color: '#6B7280' },
    { type: 'supports', label: 'Supports', color: '#10B981' },
    { type: 'contradicts', label: 'Contradicts', color: '#EF4444' },
    { type: 'elaborates', label: 'Elaborates', color: '#3B82F6' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Connection Type:</span>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as ConnectionType)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {connectionTypes.map(({ type, label }) => (
          <option key={type} value={type}>
            {label}
          </option>
        ))}
      </select>
      <div className="text-xs text-gray-500 ml-2">
        Shift+Click nodes to connect
      </div>
    </div>
  );
};
