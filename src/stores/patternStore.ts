import { create } from 'zustand';
import {
  IsolatedNodeDetection,
  UnsupportedClaim,
  UnansweredQuestion,
  ContradictionPattern
} from '../types/patterns';

export type PatternType =
  | 'isolated'
  | 'unsupported_claims'
  | 'unanswered_questions'
  | 'contradictions';

interface PatternDetection {
  id: string;
  type: PatternType;
  data: IsolatedNodeDetection[] | UnsupportedClaim[] | UnansweredQuestion[] | ContradictionPattern[];
  detectedAt: Date;
  dismissed: boolean;
}

interface PatternStore {
  patterns: PatternDetection[];
  minimized: boolean;
  enabled: Set<PatternType>;

  addPattern: (type: PatternType, data: any) => void;
  dismissPattern: (type: PatternType) => void;
  setMinimized: (minimized: boolean) => void;
  togglePattern: (type: PatternType) => void;
  clearAll: () => void;
}

export const usePatternStore = create<PatternStore>((set) => ({
  patterns: [],
  minimized: false,
  enabled: new Set(['isolated', 'unsupported_claims', 'unanswered_questions', 'contradictions']),

  addPattern: (type, data) => {
    set((state) => ({
      patterns: [
        ...state.patterns.filter(p => p.type !== type),
        {
          id: `${type}-${Date.now()}`,
          type,
          data,
          detectedAt: new Date(),
          dismissed: false
        }
      ]
    }));
  },

  dismissPattern: (type) => {
    set((state) => ({
      patterns: state.patterns.filter(p => p.type !== type)
    }));
  },

  setMinimized: (minimized) => set({ minimized }),

  togglePattern: (type) => {
    set((state) => {
      const newEnabled = new Set(state.enabled);
      if (newEnabled.has(type)) {
        newEnabled.delete(type);
      } else {
        newEnabled.add(type);
      }
      return { enabled: newEnabled };
    });
  },

  clearAll: () => set({ patterns: [] })
}));
