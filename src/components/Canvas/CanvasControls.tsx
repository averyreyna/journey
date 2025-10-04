import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

export const CanvasControls: React.FC = () => {
  const { viewport, setViewport, zoomViewport } = useCanvasStore();

  const handleZoomIn = () => {
    zoomViewport(0.1);
  };

  const handleZoomOut = () => {
    zoomViewport(-0.1);
  };

  const handleResetZoom = () => {
    setViewport(0, 0, 1);
  };

  const zoomPercentage = Math.round(viewport.scale * 100);

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2">
      <button
        onClick={handleZoomIn}
        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title="Zoom In"
      >
        +
      </button>
      <div className="px-3 py-1 text-center text-sm font-medium text-gray-700">
        {zoomPercentage}%
      </div>
      <button
        onClick={handleZoomOut}
        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title="Zoom Out"
      >
        −
      </button>
      <button
        onClick={handleResetZoom}
        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
        title="Reset View"
      >
        Reset
      </button>
    </div>
  );
};
