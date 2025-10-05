import { NodeType } from './canvas';

export interface IsolatedNodeDetection {
  nodeId: string;
  nodeType: NodeType;
  nodeContent: string;
  createdAt: Date;
  timeSinceCreation: number;
  canvasContext: {
    totalNodes: number;
    connectedClusters: number;
  };
}

export interface UnsupportedClaim {
  claimNodeId: string;
  claimContent: string;
  hasOutgoingSupports: boolean;
  relatedNodes: {
    questions: string[];
    ideas: string[];
  };
}

export interface UnansweredQuestion {
  questionNodeId: string;
  questionContent: string;
  ageInDays: number;
  hasIncoming: boolean;
  relatedContext: {
    nearbyNodes: Array<{
      id: string;
      type: NodeType;
      spatialDistance: number;
    }>;
  };
}

export interface ContradictionPattern {
  claim1: {
    id: string;
    content: string;
    evidenceCount: number;
  };
  claim2: {
    id: string;
    content: string;
    evidenceCount: number;
  };
  connectionId: string;
  isExplicitlyAcknowledged: boolean;
}
