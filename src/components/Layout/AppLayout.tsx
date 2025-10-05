import React, { useState, useEffect, useRef } from 'react';
import { WritingCanvas } from '../Canvas/WritingCanvas';
import { CanvasControls } from '../Canvas/CanvasControls';
import { Toolbar } from '../UI/Toolbar';
import { ExportPanel } from '../UI/ExportPanel';
import { InterventionPanel } from '../UI/InterventionPanel';
import { NodeType } from '../../types/canvas';
import {
  useCanvasStore,
  saveCanvasToLocalStorage,
  loadCanvasFromLocalStorage,
} from '../../stores/canvasStore';
import { usePatternDetection } from '../../hooks/usePatternDetection';

export const AppLayout: React.FC = () => {
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType>('idea');
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { resetCanvas } = useCanvasStore();

  // Add pattern detection (runs every 30 seconds)
  usePatternDetection(30000);

  // Load saved state on mount
  useEffect(() => {
    loadCanvasFromLocalStorage();
  }, []);

  // Auto-save on changes
  useEffect(() => {
    const unsubscribe = useCanvasStore.subscribe(() => {
      saveCanvasToLocalStorage();
    });

    return () => unsubscribe();
  }, []);

  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      resetCanvas();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar
        selectedNodeType={selectedNodeType}
        onNodeTypeChange={setSelectedNodeType}
        onExport={() => setShowExportPanel(true)}
        onClear={handleClear}
      />

      <div ref={containerRef} className="flex-1 relative">
        <WritingCanvas
          width={canvasSize.width}
          height={canvasSize.height}
          selectedNodeType={selectedNodeType}
        />
        <CanvasControls />
        <InterventionPanel />

        {/* Help panel */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-sm mb-2">Quick Guide</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Double-click canvas to create node</li>
            <li>• Drag nodes to move them</li>
            <li>• Click node to select</li>
            <li>• Delete/Backspace to remove selected</li>
            <li>• Scroll to zoom</li>
            <li>• Ctrl/Cmd+Drag to pan</li>
          </ul>
        </div>
      </div>

      {showExportPanel && (
        <ExportPanel onClose={() => setShowExportPanel(false)} />
      )}
    </div>
  );
};
