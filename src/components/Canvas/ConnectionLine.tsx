import React from 'react';
import { Arrow } from 'react-konva';
import { Connection, WritingNode } from '../../types/canvas';
import { getNodeConnectionPoint } from '../../utils/nodeUtils';
import {
  getConnectionColor,
  getConnectionStrokeWidth,
  getConnectionDash,
} from '../../utils/connectionUtils';

interface ConnectionLineProps {
  connection: Connection;
  fromNode: WritingNode;
  toNode: WritingNode;
  onDelete?: (id: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  fromNode,
  toNode,
  onDelete,
}) => {
  const fromPoint = getNodeConnectionPoint(
    fromNode,
    toNode.x + toNode.width / 2,
    toNode.y + toNode.height / 2
  );

  const toPoint = getNodeConnectionPoint(
    toNode,
    fromNode.x + fromNode.width / 2,
    fromNode.y + fromNode.height / 2
  );

  const color = getConnectionColor(connection.type);
  const strokeWidth = getConnectionStrokeWidth(connection.type);
  const dash = getConnectionDash(connection.type);

  return (
    <Arrow
      points={[fromPoint.x, fromPoint.y, toPoint.x, toPoint.y]}
      stroke={color}
      strokeWidth={strokeWidth}
      fill={color}
      dash={dash}
      pointerLength={10}
      pointerWidth={10}
      onClick={() => onDelete?.(connection.id)}
      onTap={() => onDelete?.(connection.id)}
      hitStrokeWidth={20}
    />
  );
};
