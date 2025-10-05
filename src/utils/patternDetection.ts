import { CanvasState, WritingNode, NodeType } from '../types/canvas';
import {
  IsolatedNodeDetection,
  UnsupportedClaim,
  UnansweredQuestion,
  ContradictionPattern
} from '../types/patterns';

export function detectIsolatedNodes(canvasState: CanvasState): IsolatedNodeDetection[] {
  const currentTime = new Date();
  const MIN_AGE_MS = 5 * 60 * 1000; // 5 minutes

  return canvasState.nodes.filter(node => {
    const hasNoConnections =
      !canvasState.connections.some(conn =>
        conn.from_node_id === node.id || conn.to_node_id === node.id
      );

    const isOldEnough =
      (currentTime.getTime() - node.created_at.getTime()) > MIN_AGE_MS;

    return hasNoConnections && isOldEnough;
  }).map(node => ({
    nodeId: node.id,
    nodeType: node.type,
    nodeContent: node.content,
    createdAt: node.created_at,
    timeSinceCreation: currentTime.getTime() - node.created_at.getTime(),
    canvasContext: {
      totalNodes: canvasState.nodes.length,
      connectedClusters: calculateConnectedClusters(canvasState)
    }
  }));
}

function calculateConnectedClusters(canvasState: CanvasState): number {
  // Simple union-find for counting clusters
  const visited = new Set<string>();
  let clusters = 0;

  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    canvasState.connections.forEach(conn => {
      if (conn.from_node_id === nodeId) dfs(conn.to_node_id);
      if (conn.to_node_id === nodeId) dfs(conn.from_node_id);
    });
  };

  canvasState.nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfs(node.id);
      clusters++;
    }
  });

  return clusters;
}

export function detectUnsupportedClaims(canvasState: CanvasState): UnsupportedClaim[] {
  const claimNodes = canvasState.nodes.filter(n => n.type === 'claim');
  const MIN_AGE_MS = 10 * 60 * 1000;
  const currentTime = new Date();

  return claimNodes.filter(claim => {
    const isOldEnough =
      (currentTime.getTime() - claim.created_at.getTime()) > MIN_AGE_MS;

    const hasEvidenceSupport = canvasState.connections.some(conn =>
      conn.to_node_id === claim.id &&
      conn.type === 'supports' &&
      canvasState.nodes.find(n =>
        n.id === conn.from_node_id && n.type === 'evidence'
      )
    );

    return isOldEnough && !hasEvidenceSupport;
  }).map(claim => {
    const connectedConnections = canvasState.connections.filter(
      conn => conn.from_node_id === claim.id || conn.to_node_id === claim.id
    );

    return {
      claimNodeId: claim.id,
      claimContent: claim.content,
      hasOutgoingSupports: connectedConnections.some(
        conn => conn.from_node_id === claim.id && conn.type === 'supports'
      ),
      relatedNodes: {
        questions: getConnectedNodesByType(claim.id, 'question', canvasState),
        ideas: getConnectedNodesByType(claim.id, 'idea', canvasState)
      }
    };
  });
}

function getConnectedNodesByType(
  nodeId: string,
  type: NodeType,
  canvasState: CanvasState
): string[] {
  const connected = canvasState.connections
    .filter(conn => conn.from_node_id === nodeId || conn.to_node_id === nodeId)
    .map(conn => conn.from_node_id === nodeId ? conn.to_node_id : conn.from_node_id);

  return canvasState.nodes
    .filter(n => connected.includes(n.id) && n.type === type)
    .map(n => n.id);
}

export function detectUnansweredQuestions(
  canvasState: CanvasState
): UnansweredQuestion[] {
  const questionNodes = canvasState.nodes.filter(n => n.type === 'question');
  const MIN_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours
  const currentTime = new Date();

  return questionNodes.filter(question => {
    const age = currentTime.getTime() - question.created_at.getTime();
    const hasOutgoing = canvasState.connections.some(
      conn => conn.from_node_id === question.id
    );

    return age > MIN_AGE_MS && !hasOutgoing;
  }).map(question => {
    const ageInDays = Math.floor(
      (currentTime.getTime() - question.created_at.getTime()) /
      (24 * 60 * 60 * 1000)
    );

    return {
      questionNodeId: question.id,
      questionContent: question.content,
      ageInDays,
      hasIncoming: canvasState.connections.some(
        conn => conn.to_node_id === question.id
      ),
      relatedContext: {
        nearbyNodes: findNearbyNodes(question, canvasState, 300)
      }
    };
  });
}

function findNearbyNodes(
  centerNode: WritingNode,
  canvasState: CanvasState,
  radiusPixels: number
): Array<{id: string; type: NodeType; spatialDistance: number}> {
  return canvasState.nodes
    .filter(node => node.id !== centerNode.id)
    .map(node => ({
      id: node.id,
      type: node.type,
      spatialDistance: Math.sqrt(
        Math.pow(node.x - centerNode.x, 2) +
        Math.pow(node.y - centerNode.y, 2)
      )
    }))
    .filter(item => item.spatialDistance <= radiusPixels)
    .sort((a, b) => a.spatialDistance - b.spatialDistance)
    .slice(0, 5);
}

export function detectContradictions(
  canvasState: CanvasState
): ContradictionPattern[] {
  const contradictionConnections = canvasState.connections.filter(
    conn => conn.type === 'contradicts'
  );

  return contradictionConnections.map(conn => {
    const claim1 = canvasState.nodes.find(n => n.id === conn.from_node_id);
    const claim2 = canvasState.nodes.find(n => n.id === conn.to_node_id);

    if (!claim1 || !claim2 || claim1.type !== 'claim' || claim2.type !== 'claim') {
      return null;
    }

    const claim1Evidence = canvasState.connections.filter(
      c => c.to_node_id === claim1.id &&
           c.type === 'supports' &&
           canvasState.nodes.find(n => n.id === c.from_node_id)?.type === 'evidence'
    ).length;

    const claim2Evidence = canvasState.connections.filter(
      c => c.to_node_id === claim2.id &&
           c.type === 'supports' &&
           canvasState.nodes.find(n => n.id === c.from_node_id)?.type === 'evidence'
    ).length;

    if (claim1Evidence === 0 || claim2Evidence === 0) {
      return null;
    }

    const hasAcknowledgment = canvasState.nodes.some(node =>
      (node.type === 'idea' || node.type === 'outline') &&
      canvasState.connections.some(
        c => (c.from_node_id === node.id || c.to_node_id === node.id) &&
             (c.from_node_id === claim1.id || c.to_node_id === claim1.id ||
              c.from_node_id === claim2.id || c.to_node_id === claim2.id)
      )
    );

    return {
      claim1: {
        id: claim1.id,
        content: claim1.content,
        evidenceCount: claim1Evidence
      },
      claim2: {
        id: claim2.id,
        content: claim2.content,
        evidenceCount: claim2Evidence
      },
      connectionId: conn.id,
      isExplicitlyAcknowledged: hasAcknowledgment
    };
  }).filter(pattern => pattern !== null) as ContradictionPattern[];
}
