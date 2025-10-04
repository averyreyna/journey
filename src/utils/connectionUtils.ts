import { v4 as uuidv4 } from 'uuid';
import { Connection, ConnectionType } from '../types/canvas';

export const CONNECTION_COLORS: Record<ConnectionType, string> = {
  supports: '#10B981',
  contradicts: '#EF4444',
  elaborates: '#3B82F6',
  general: '#6B7280',
};

export function createConnection(
  fromNodeId: string,
  toNodeId: string,
  type: ConnectionType = 'general'
): Connection {
  return {
    id: uuidv4(),
    from_node_id: fromNodeId,
    to_node_id: toNodeId,
    type,
    created_at: new Date(),
  };
}

export function getConnectionColor(type: ConnectionType): string {
  return CONNECTION_COLORS[type];
}

export function getConnectionStrokeWidth(type: ConnectionType): number {
  return type === 'supports' || type === 'contradicts' ? 3 : 2;
}

export function getConnectionDash(type: ConnectionType): number[] | undefined {
  return type === 'elaborates' ? [10, 5] : undefined;
}
