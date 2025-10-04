import { create } from 'zustand';
import { WritingNode, Connection, CanvasState, NodeType, ConnectionType } from '../types/canvas';
import { createNode } from '../utils/nodeUtils';
import { createConnection } from '../utils/connectionUtils';

interface CanvasStore extends CanvasState {
  // Node operations
  addNode: (type: NodeType, x: number, y: number, content?: string) => WritingNode;
  updateNode: (id: string, updates: Partial<WritingNode>) => void;
  deleteNode: (id: string) => void;

  // Connection operations
  addConnection: (fromNodeId: string, toNodeId: string, type?: ConnectionType) => void;
  deleteConnection: (id: string) => void;

  // Selection operations
  selectNode: (id: string, multiSelect?: boolean) => void;
  deselectNode: (id: string) => void;
  clearSelection: () => void;

  // Viewport operations
  setViewport: (x: number, y: number, scale: number) => void;
  panViewport: (dx: number, dy: number) => void;
  zoomViewport: (delta: number, centerX?: number, centerY?: number) => void;

  // Persistence
  loadState: (state: Partial<CanvasState>) => void;
  resetCanvas: () => void;
}

const INITIAL_STATE: CanvasState = {
  nodes: [],
  connections: [],
  viewport: {
    x: 0,
    y: 0,
    scale: 1,
  },
  selected_nodes: [],
};

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  ...INITIAL_STATE,

  // Node operations
  addNode: (type, x, y, content = '') => {
    const node = createNode(type, x, y, content);
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
    return node;
  },

  updateNode: (id, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? { ...node, ...updates, updated_at: new Date() }
          : node
      ),
    }));
  },

  deleteNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      connections: state.connections.filter(
        (conn) => conn.from_node_id !== id && conn.to_node_id !== id
      ),
      selected_nodes: state.selected_nodes.filter((nodeId) => nodeId !== id),
    }));
  },

  // Connection operations
  addConnection: (fromNodeId, toNodeId, type = 'general') => {
    // Prevent duplicate connections
    const { connections } = get();
    const exists = connections.some(
      (conn) =>
        conn.from_node_id === fromNodeId && conn.to_node_id === toNodeId
    );

    if (!exists && fromNodeId !== toNodeId) {
      const connection = createConnection(fromNodeId, toNodeId, type);
      set((state) => ({
        connections: [...state.connections, connection],
      }));
    }
  },

  deleteConnection: (id) => {
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id),
    }));
  },

  // Selection operations
  selectNode: (id, multiSelect = false) => {
    set((state) => {
      if (multiSelect) {
        return {
          selected_nodes: state.selected_nodes.includes(id)
            ? state.selected_nodes
            : [...state.selected_nodes, id],
        };
      }
      return { selected_nodes: [id] };
    });
  },

  deselectNode: (id) => {
    set((state) => ({
      selected_nodes: state.selected_nodes.filter((nodeId) => nodeId !== id),
    }));
  },

  clearSelection: () => {
    set({ selected_nodes: [] });
  },

  // Viewport operations
  setViewport: (x, y, scale) => {
    set({
      viewport: { x, y, scale: Math.max(0.1, Math.min(3, scale)) },
    });
  },

  panViewport: (dx, dy) => {
    set((state) => ({
      viewport: {
        ...state.viewport,
        x: state.viewport.x + dx,
        y: state.viewport.y + dy,
      },
    }));
  },

  zoomViewport: (delta, centerX = 0, centerY = 0) => {
    set((state) => {
      const { viewport } = state;
      const oldScale = viewport.scale;
      const newScale = Math.max(0.1, Math.min(3, oldScale + delta));

      // Zoom towards the center point
      const scaleRatio = newScale / oldScale;
      const newX = centerX - (centerX - viewport.x) * scaleRatio;
      const newY = centerY - (centerY - viewport.y) * scaleRatio;

      return {
        viewport: {
          x: newX,
          y: newY,
          scale: newScale,
        },
      };
    });
  },

  // Persistence
  loadState: (state) => {
    set((currentState) => ({
      ...currentState,
      ...state,
      // Convert date strings back to Date objects
      nodes: state.nodes?.map((node) => ({
        ...node,
        created_at: new Date(node.created_at),
        updated_at: new Date(node.updated_at),
      })) || currentState.nodes,
      connections: state.connections?.map((conn) => ({
        ...conn,
        created_at: new Date(conn.created_at),
      })) || currentState.connections,
    }));
  },

  resetCanvas: () => {
    set(INITIAL_STATE);
  },
}));

// Persistence to localStorage
export function saveCanvasToLocalStorage() {
  const state = useCanvasStore.getState();
  const dataToSave = {
    nodes: state.nodes,
    connections: state.connections,
    viewport: state.viewport,
  };
  localStorage.setItem('journey-canvas-state', JSON.stringify(dataToSave));
}

export function loadCanvasFromLocalStorage() {
  try {
    const saved = localStorage.getItem('journey-canvas-state');
    if (saved) {
      const state = JSON.parse(saved);
      useCanvasStore.getState().loadState(state);
    }
  } catch (error) {
    console.error('Failed to load canvas state:', error);
  }
}
