export type NodeType = 'idea' | 'claim' | 'evidence' | 'question' | 'outline';
export type ConnectionType = 'supports' | 'contradicts' | 'elaborates' | 'general';

export interface WritingNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  type: NodeType;
  created_at: Date;
  updated_at: Date;
}

export interface Connection {
  id: string;
  from_node_id: string;
  to_node_id: string;
  type: ConnectionType;
  created_at: Date;
}

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface CanvasState {
  nodes: WritingNode[];
  connections: Connection[];
  viewport: Viewport;
  selected_nodes: string[];
}

export interface NodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  dash?: number[];
}
