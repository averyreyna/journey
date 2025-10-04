import React from 'react';
import { NodeType } from '../../types/canvas';
import { NODE_STYLES } from '../../utils/nodeUtils';

interface NodeTypeSelectorProps {
  value: NodeType;
  onChange: (type: NodeType) => void;
}

export const NodeTypeSelector: React.FC<NodeTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const nodeTypes: NodeType[] = ['idea', 'claim', 'evidence', 'question', 'outline'];

  return (
    <div className="flex gap-2">
      {nodeTypes.map((type) => {
        const style = NODE_STYLES[type];
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`px-4 py-2 rounded-md capitalize transition-all ${
              value === type ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              backgroundColor: style.fill,
              border: `2px solid ${style.stroke}`,
            }}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
};
