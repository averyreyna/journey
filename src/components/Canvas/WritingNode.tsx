import React, { useRef, useState, useEffect } from 'react';
import { Group, Rect, Text } from 'react-konva';
import { WritingNode as WritingNodeType } from '../../types/canvas';
import { getNodeStyle } from '../../utils/nodeUtils';
import Konva from 'konva';

interface WritingNodeProps {
  node: WritingNodeType;
  isSelected: boolean;
  onSelect: (id: string, multiSelect: boolean) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDoubleClick: (id: string) => void;
  onContentChange: (id: string, content: string) => void;
}

export const WritingNode: React.FC<WritingNodeProps> = ({
  node,
  isSelected,
  onSelect,
  onDragEnd,
  onDoubleClick,
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const [isDragging, setIsDragging] = useState(false);

  const style = getNodeStyle(node.type);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsDragging(false);
    onDragEnd(node.id, e.target.x(), e.target.y());
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const multiSelect = e.evt.shiftKey || e.evt.metaKey || e.evt.ctrlKey;
    onSelect(node.id, multiSelect);
  };

  const handleDoubleClick = () => {
    onDoubleClick(node.id);
  };

  return (
    <Group
      ref={groupRef}
      x={node.x}
      y={node.y}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
      onDblClick={handleDoubleClick}
      onDblTap={handleDoubleClick}
    >
      {/* Main rectangle */}
      <Rect
        width={node.width}
        height={node.height}
        fill={style.fill}
        stroke={isSelected ? '#000000' : style.stroke}
        strokeWidth={isSelected ? style.strokeWidth + 1 : style.strokeWidth}
        cornerRadius={style.cornerRadius}
        dash={style.dash}
        shadowBlur={isDragging ? 10 : isSelected ? 5 : 0}
        shadowOpacity={0.3}
      />

      {/* Content text */}
      <Text
        text={node.content || `${node.type} node`}
        x={10}
        y={10}
        width={node.width - 20}
        height={node.height - 20}
        fontSize={14}
        fontFamily="Arial"
        fill="#1F2937"
        align="left"
        verticalAlign="top"
        wrap="word"
        ellipsis={true}
      />

      {/* Selection indicator */}
      {isSelected && (
        <>
          {/* Resize handles */}
          <Rect
            x={node.width - 8}
            y={node.height - 8}
            width={8}
            height={8}
            fill="#3B82F6"
            cornerRadius={2}
          />
        </>
      )}
    </Group>
  );
};
