import React from 'react';
import { usePatternStore } from '../../stores/patternStore';
import { IsolatedNodeDetection, UnsupportedClaim, UnansweredQuestion, ContradictionPattern } from '../../types/patterns';

export const InterventionPanel: React.FC = () => {
  const { patterns, dismissPattern, minimized, setMinimized } = usePatternStore();

  if (patterns.length === 0) return null;

  const isolatedPatterns = patterns.filter(p => p.type === 'isolated');
  const unsupportedPatterns = patterns.filter(p => p.type === 'unsupported_claims');
  const unansweredPatterns = patterns.filter(p => p.type === 'unanswered_questions');
  const contradictionPatterns = patterns.filter(p => p.type === 'contradictions');

  return (
    <div className="fixed bottom-4 left-80 bg-white rounded-lg shadow-xl max-w-md border-2 border-blue-200 z-50">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-bold text-gray-800">
          Canvas Insights ({patterns.length})
        </h3>
        <button
          onClick={() => setMinimized(!minimized)}
          className="text-gray-500 hover:text-gray-700"
        >
          {minimized ? '▼' : '▲'}
        </button>
      </div>

      {!minimized && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Isolated Nodes */}
          {isolatedPatterns.length > 0 && (
            <div className="border-l-4 border-orange-400 pl-3">
              <div className="mb-2 font-semibold text-sm">Isolated Thoughts</div>
              <p className="text-sm text-gray-600 mb-3">
                You have {(isolatedPatterns[0].data as IsolatedNodeDetection[]).length} node
                {(isolatedPatterns[0].data as IsolatedNodeDetection[]).length > 1 ? 's' : ''} with no connections
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                  Review
                </button>
                <button
                  onClick={() => dismissPattern('isolated')}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Unsupported Claims */}
          {unsupportedPatterns.length > 0 && (
            <div className="border-l-4 border-yellow-400 pl-3">
              <div className="mb-2 font-semibold text-sm">Unsupported Claims</div>
              <p className="text-sm text-gray-600 mb-3">
                You have {(unsupportedPatterns[0].data as UnsupportedClaim[]).length} claim
                {(unsupportedPatterns[0].data as UnsupportedClaim[]).length > 1 ? 's' : ''} without evidence
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                  Review
                </button>
                <button
                  onClick={() => dismissPattern('unsupported_claims')}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Unanswered Questions */}
          {unansweredPatterns.length > 0 && (
            <div className="border-l-4 border-purple-400 pl-3">
              <div className="mb-2 font-semibold text-sm">Unanswered Questions</div>
              <p className="text-sm text-gray-600 mb-3">
                You have {(unansweredPatterns[0].data as UnansweredQuestion[]).length} question
                {(unansweredPatterns[0].data as UnansweredQuestion[]).length > 1 ? 's' : ''} pending answers
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                  Review
                </button>
                <button
                  onClick={() => dismissPattern('unanswered_questions')}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Contradictions */}
          {contradictionPatterns.length > 0 && (
            <div className="border-l-4 border-red-400 pl-3">
              <div className="mb-2 font-semibold text-sm">Contradictory Claims</div>
              <p className="text-sm text-gray-600 mb-3">
                You have {(contradictionPatterns[0].data as ContradictionPattern[]).length} contradiction
                {(contradictionPatterns[0].data as ContradictionPattern[]).length > 1 ? 's' : ''} to address
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                  Review
                </button>
                <button
                  onClick={() => dismissPattern('contradictions')}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
