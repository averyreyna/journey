import { WritingNode, Connection } from '../types/canvas';

interface NodeWithDepth {
  node: WritingNode;
  depth: number;
  children: string[];
}

export class DocumentGenerator {
  private nodes: WritingNode[];
  private connections: Connection[];

  constructor(nodes: WritingNode[], connections: Connection[]) {
    this.nodes = nodes;
    this.connections = connections;
  }

  /**
   * Generate a linear document from the canvas nodes and connections
   */
  generateLinearDocument(): string {
    if (this.nodes.length === 0) {
      return '# Empty Canvas\n\nNo content to export.';
    }

    // Build a graph structure
    const nodeMap = new Map(this.nodes.map((n) => [n.id, n]));
    const adjacencyList = this.buildAdjacencyList();

    // Find root nodes (nodes with no incoming connections)
    const rootNodes = this.findRootNodes();

    // Perform topological sort to order nodes
    const orderedNodes = this.topologicalSort(rootNodes, adjacencyList);

    // Generate markdown document
    return this.generateMarkdown(orderedNodes);
  }

  /**
   * Build adjacency list from connections
   */
  private buildAdjacencyList(): Map<string, string[]> {
    const adjacencyList = new Map<string, string[]>();

    // Initialize all nodes
    this.nodes.forEach((node) => {
      adjacencyList.set(node.id, []);
    });

    // Build connections
    this.connections.forEach((conn) => {
      const children = adjacencyList.get(conn.from_node_id) || [];
      children.push(conn.to_node_id);
      adjacencyList.set(conn.from_node_id, children);
    });

    return adjacencyList;
  }

  /**
   * Find nodes with no incoming connections (root nodes)
   */
  private findRootNodes(): string[] {
    const hasIncoming = new Set<string>();

    this.connections.forEach((conn) => {
      hasIncoming.add(conn.to_node_id);
    });

    return this.nodes
      .filter((node) => !hasIncoming.has(node.id))
      .map((node) => node.id);
  }

  /**
   * Perform topological sort using DFS
   */
  private topologicalSort(
    rootNodes: string[],
    adjacencyList: Map<string, string[]>
  ): NodeWithDepth[] {
    const visited = new Set<string>();
    const result: NodeWithDepth[] = [];

    const dfs = (nodeId: string, depth: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = this.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const children = adjacencyList.get(nodeId) || [];
      result.push({ node, depth, children });

      children.forEach((childId) => {
        dfs(childId, depth + 1);
      });
    };

    // Start DFS from root nodes
    rootNodes.forEach((rootId) => dfs(rootId, 0));

    // Add any unvisited nodes (disconnected components)
    this.nodes.forEach((node) => {
      if (!visited.has(node.id)) {
        const children = adjacencyList.get(node.id) || [];
        result.push({ node, depth: 0, children });
      }
    });

    return result;
  }

  /**
   * Generate markdown from ordered nodes
   */
  private generateMarkdown(orderedNodes: NodeWithDepth[]): string {
    let markdown = '# Journey Canvas Export\n\n';
    markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
    markdown += '---\n\n';

    orderedNodes.forEach(({ node, depth }) => {
      const indent = '  '.repeat(depth);
      const heading = '#'.repeat(Math.min(depth + 2, 6));

      switch (node.type) {
        case 'outline':
          markdown += `${heading} ${node.content || 'Outline'}\n\n`;
          break;

        case 'claim':
          markdown += `${indent}**Claim:** ${node.content}\n\n`;
          break;

        case 'evidence':
          markdown += `${indent}*Evidence:* ${node.content}\n\n`;
          break;

        case 'question':
          markdown += `${indent}> **Question:** ${node.content}\n\n`;
          break;

        case 'idea':
        default:
          markdown += `${indent}${node.content}\n\n`;
          break;
      }
    });

    markdown += '\n---\n\n';
    markdown += `*Total nodes: ${this.nodes.length}*\n`;
    markdown += `*Total connections: ${this.connections.length}*\n`;

    return markdown;
  }

  /**
   * Generate a simple plain text export
   */
  generatePlainText(): string {
    if (this.nodes.length === 0) {
      return 'Empty Canvas\n\nNo content to export.';
    }

    let text = 'JOURNEY CANVAS EXPORT\n';
    text += `Exported on ${new Date().toLocaleString()}\n`;
    text += '='.repeat(50) + '\n\n';

    // Sort nodes by creation date
    const sortedNodes = [...this.nodes].sort(
      (a, b) => a.created_at.getTime() - b.created_at.getTime()
    );

    sortedNodes.forEach((node, index) => {
      text += `${index + 1}. [${node.type.toUpperCase()}]\n`;
      text += `   ${node.content || '(empty)'}\n\n`;
    });

    text += '='.repeat(50) + '\n';
    text += `Total nodes: ${this.nodes.length}\n`;
    text += `Total connections: ${this.connections.length}\n`;

    return text;
  }

  /**
   * Generate JSON export
   */
  generateJSON(): string {
    return JSON.stringify(
      {
        exported_at: new Date().toISOString(),
        nodes: this.nodes,
        connections: this.connections,
      },
      null,
      2
    );
  }
}
