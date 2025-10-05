import { useEffect } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { usePatternStore } from '../stores/patternStore';
import {
  detectIsolatedNodes,
  detectUnsupportedClaims,
  detectUnansweredQuestions,
  detectContradictions
} from '../utils/patternDetection';

export function usePatternDetection(intervalMs: number = 30000) {
  const { nodes, connections } = useCanvasStore();
  const { addPattern, enabled } = usePatternStore();

  useEffect(() => {
    const runDetection = () => {
      const canvasState = {
        nodes,
        connections,
        viewport: { x: 0, y: 0, scale: 1 },
        selected_nodes: []
      };

      if (enabled.has('isolated')) {
        const isolated = detectIsolatedNodes(canvasState);
        if (isolated.length > 0) {
          addPattern('isolated', isolated);
        }
      }

      if (enabled.has('unsupported_claims')) {
        const unsupported = detectUnsupportedClaims(canvasState);
        if (unsupported.length > 0) {
          addPattern('unsupported_claims', unsupported);
        }
      }

      if (enabled.has('unanswered_questions')) {
        const unanswered = detectUnansweredQuestions(canvasState);
        if (unanswered.length > 0) {
          addPattern('unanswered_questions', unanswered);
        }
      }

      if (enabled.has('contradictions')) {
        const contradictions = detectContradictions(canvasState);
        if (contradictions.length > 0) {
          addPattern('contradictions', contradictions);
        }
      }
    };

    // Run immediately
    runDetection();

    // Then on interval
    const timer = setInterval(runDetection, intervalMs);

    return () => clearInterval(timer);
  }, [nodes, connections, enabled, intervalMs, addPattern]);
}
