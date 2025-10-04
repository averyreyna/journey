import React, { useState } from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import { DocumentGenerator } from '../../utils/documentGenerator';

interface ExportPanelProps {
  onClose: () => void;
}

type ExportFormat = 'markdown' | 'plaintext' | 'json';

export const ExportPanel: React.FC<ExportPanelProps> = ({ onClose }) => {
  const { nodes, connections } = useCanvasStore();
  const [format, setFormat] = useState<ExportFormat>('markdown');
  const [exportedContent, setExportedContent] = useState('');

  const handleExport = () => {
    const generator = new DocumentGenerator(nodes, connections);

    let content = '';
    switch (format) {
      case 'markdown':
        content = generator.generateLinearDocument();
        break;
      case 'plaintext':
        content = generator.generatePlainText();
        break;
      case 'json':
        content = generator.generateJSON();
        break;
    }

    setExportedContent(content);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedContent);
      alert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journey-canvas-export.${
      format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt'
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Export Canvas</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="flex gap-2">
              {[
                { value: 'markdown', label: 'Markdown' },
                { value: 'plaintext', label: 'Plain Text' },
                { value: 'json', label: 'JSON' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value as ExportFormat)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    format === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={handleExport}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Generate Export
            </button>
          </div>

          {exportedContent && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Exported Content
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
              <pre className="bg-gray-50 border border-gray-300 rounded-lg p-4 text-sm overflow-auto max-h-96 font-mono">
                {exportedContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
