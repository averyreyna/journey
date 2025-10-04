import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { WritingNode } from './WritingNode';
import { ConnectionLine } from './ConnectionLine';
import { useCanvasStore } from '../../stores/canvasStore';
import Konva from 'konva';
import { NodeType } from '../../types/canvas';

interface WritingCanvasProps {
  width: number;
  height: number;
  selectedNodeType: NodeType;
}

export const WritingCanvas: React.FC<WritingCanvasProps> = ({
  width,
  height,
  selectedNodeType,
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [tempConnectionEnd, setTempConnectionEnd] = useState<{ x: number; y: number } | null>(null);

  const {
    nodes,
    connections,
    viewport,
    selected_nodes,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    selectNode,
    clearSelection,
    panViewport,
    zoomViewport,
  } = useCanvasStore();

  const [isPanning, setIsPanning] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = viewport.scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - viewport.x) / oldScale,
      y: (pointer.y - viewport.y) / oldScale,
    };

    const delta = e.evt.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.1, Math.min(3, oldScale + delta));

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    zoomViewport(delta, pointer.x, pointer.y);
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Check if clicking on empty canvas
    const clickedOnEmpty = e.target === e.target.getStage();

    if (e.evt.button === 1 || e.evt.button === 2 || e.evt.metaKey || e.evt.ctrlKey) {
      // Middle or right mouse button - start panning
      setIsPanning(true);
      const pos = e.target.getStage()?.getPointerPosition();
      if (pos) {
        setLastPointerPosition(pos);
      }
      return;
    }

    if (clickedOnEmpty) {
      clearSelection();
    }
  };

  const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (isPanning) {
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (pos && lastPointerPosition) {
        const dx = pos.x - lastPointerPosition.x;
        const dy = pos.y - lastPointerPosition.y;
        panViewport(dx, dy);
        setLastPointerPosition(pos);
      }
    }

    if (isDrawingConnection && connectionStart) {
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();
      if (pointer) {
        const worldPos = {
          x: (pointer.x - viewport.x) / viewport.scale,
          y: (pointer.y - viewport.y) / viewport.scale,
        };
        setTempConnectionEnd(worldPos);
      }
    }
  };

  const handleStageMouseUp = () => {
    setIsPanning(false);
    if (isDrawingConnection) {
      setIsDrawingConnection(false);
      setConnectionStart(null);
      setTempConnectionEnd(null);
    }
  };

  const handleStageDblClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      const stage = stageRef.current;
      const pointer = stage?.getPointerPosition();

      if (pointer) {
        // Convert screen coordinates to world coordinates
        const worldX = (pointer.x - viewport.x) / viewport.scale;
        const worldY = (pointer.y - viewport.y) / viewport.scale;

        addNode(selectedNodeType, worldX, worldY);
      }
    }
  };

  const handleNodeDragEnd = (id: string, x: number, y: number) => {
    updateNode(id, { x, y });
  };

  const handleNodeDoubleClick = (id: string) => {
    // TODO: Implement inline editing
    console.log('Edit node:', id);
  };

  const handleNodeSelect = (id: string, multiSelect: boolean) => {
    selectNode(id, multiSelect);
  };

  const handleDeleteConnection = (id: string) => {
    deleteConnection(id);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete selected nodes
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected_nodes.length > 0) {
        selected_nodes.forEach((id) => deleteNode(id));
      }

      // Deselect all
      if (e.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selected_nodes, deleteNode, clearSelection]);

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      onWheel={handleWheel}
      onMouseDown={handleStageMouseDown}
      onMouseMove={handleStageMouseMove}
      onMouseUp={handleStageMouseUp}
      onDblClick={handleStageDblClick}
      onContextMenu={(e) => e.evt.preventDefault()}
    >
      <Layer
        x={viewport.x}
        y={viewport.y}
        scaleX={viewport.scale}
        scaleY={viewport.scale}
      >
        {/* Render connections first (below nodes) */}
        {connections.map((connection) => {
          const fromNode = nodes.find((n) => n.id === connection.from_node_id);
          const toNode = nodes.find((n) => n.id === connection.to_node_id);

          if (!fromNode || !toNode) return null;

          return (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              fromNode={fromNode}
              toNode={toNode}
              onDelete={handleDeleteConnection}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map((node) => (
          <WritingNode
            key={node.id}
            node={node}
            isSelected={selected_nodes.includes(node.id)}
            onSelect={handleNodeSelect}
            onDragEnd={handleNodeDragEnd}
            onDoubleClick={handleNodeDoubleClick}
            onContentChange={(id, content) => updateNode(id, { content })}
          />
        ))}
      </Layer>
    </Stage>
  );
};
