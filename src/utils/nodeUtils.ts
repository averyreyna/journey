import { v4 as uuidv4 } from 'uuid';
import { WritingNode, NodeType, NodeStyle } from '../types/canvas';

export const NODE_STYLES: Record<NodeType, NodeStyle> = {
  idea: {
    fill: '#DBEAFE',
    stroke: '#3B82F6',
    strokeWidth: 2,
    cornerRadius: 8,
  },
  claim: {
    fill: '#FED7AA',
    stroke: '#F97316',
    strokeWidth: 3,
    cornerRadius: 4,
  },
  evidence: {
    fill: '#D1FAE5',
    stroke: '#10B981',
    strokeWidth: 2,
    cornerRadius: 4,
    dash: [5, 5],
  },
  question: {
    fill: '#E9D5FF',
    stroke: '#A855F7',
    strokeWidth: 2,
    cornerRadius: 12,
  },
  outline: {
    fill: '#F3F4F6',
    stroke: '#6B7280',
    strokeWidth: 2,
    cornerRadius: 4,
  },
};

export const DEFAULT_NODE_WIDTH = 200;
export const DEFAULT_NODE_HEIGHT = 100;

export function createNode(
  type: NodeType,
  x: number,
  y: number,
  content: string = ''
): WritingNode {
  return {
    id: uuidv4(),
    x,
    y,
    width: DEFAULT_NODE_WIDTH,
    height: DEFAULT_NODE_HEIGHT,
    content,
    type,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export function getNodeStyle(type: NodeType): NodeStyle {
  return NODE_STYLES[type];
}

export function isPointInNode(
  x: number,
  y: number,
  node: WritingNode
): boolean {
  return (
    x >= node.x &&
    x <= node.x + node.width &&
    y >= node.y &&
    y <= node.y + node.height
  );
}

export function getNodeCenter(node: WritingNode): { x: number; y: number } {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

export function getNodeConnectionPoint(
  node: WritingNode,
  targetX: number,
  targetY: number
): { x: number; y: number } {
  const center = getNodeCenter(node);
  const dx = targetX - center.x;
  const dy = targetY - center.y;

  // Calculate intersection with node bounds
  const angle = Math.atan2(dy, dx);
  const halfWidth = node.width / 2;
  const halfHeight = node.height / 2;

  // Determine which edge the line intersects
  const m = dy / dx;

  if (Math.abs(m) < halfHeight / halfWidth) {
    // Intersects left or right edge
    const x = dx > 0 ? halfWidth : -halfWidth;
    return {
      x: center.x + x,
      y: center.y + m * x,
    };
  } else {
    // Intersects top or bottom edge
    const y = dy > 0 ? halfHeight : -halfHeight;
    return {
      x: center.x + y / m,
      y: center.y + y,
    };
  }
}
