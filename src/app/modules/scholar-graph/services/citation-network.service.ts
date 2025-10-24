import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { 
  CitationNode, 
  CitationLink, 
  CitationNetwork, 
  NetworkStatistics,
  NetworkFilter,
  DEMO_PAPERS,
  DEMO_LINKS
} from '../models/citation-network.model';

@Injectable({
  providedIn: 'root'
})
export class CitationNetworkService {
  private readonly STORAGE_KEY = 'omnischolar_citation_networks';

  constructor() {
    this.initializeDemoData();
  }

  /**
   * Get all saved citation networks
   */
  getAllNetworks(): CitationNetwork[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    
    const networks = JSON.parse(data);
    // Convert date strings back to Date objects
    networks.forEach((network: CitationNetwork) => {
      network.createdAt = new Date(network.createdAt);
    });
    
    return networks;
  }

  /**
   * Get a specific network by ID
   */
  getNetwork(id: string): CitationNetwork | null {
    const networks = this.getAllNetworks();
    return networks.find(n => n.id === id) || null;
  }

  /**
   * Create a new citation network
   */
  createNetwork(network: Partial<CitationNetwork>): Observable<CitationNetwork> {
    const newNetwork: CitationNetwork = {
      id: crypto.randomUUID(),
      name: network.name || 'Untitled Network',
      description: network.description || '',
      createdAt: new Date(),
      nodes: network.nodes || [],
      links: network.links || [],
      centerPaperId: network.centerPaperId || ''
    };

    const networks = this.getAllNetworks();
    networks.push(newNetwork);
    this.saveNetworks(networks);

    return of(newNetwork).pipe(delay(300));
  }

  /**
   * Update an existing network
   */
  updateNetwork(id: string, updates: Partial<CitationNetwork>): Observable<CitationNetwork> {
    const networks = this.getAllNetworks();
    const index = networks.findIndex(n => n.id === id);
    
    if (index === -1) {
      throw new Error(`Network with ID ${id} not found`);
    }

    networks[index] = { ...networks[index], ...updates };
    this.saveNetworks(networks);

    return of(networks[index]).pipe(delay(300));
  }

  /**
   * Delete a network
   */
  deleteNetwork(id: string): Observable<void> {
    const networks = this.getAllNetworks();
    const filtered = networks.filter(n => n.id !== id);
    this.saveNetworks(filtered);

    return of(void 0).pipe(delay(300));
  }

  /**
   * Build citation network from a center paper
   * Simulates fetching citations and references from APIs
   */
  buildNetwork(centerId: string, depth: number = 2): Observable<CitationNetwork> {
    // In real implementation, this would call citation APIs
    // For demo, we create a network from DEMO_PAPERS
    
    const centerPaper = DEMO_PAPERS.find(p => p.id === centerId) || DEMO_PAPERS[0];
    const nodes: CitationNode[] = [centerPaper];
    const links: CitationLink[] = [];

    // Add papers that cite the center paper
    const citingPapers = DEMO_LINKS
      .filter(link => link.target === centerId)
      .map(link => DEMO_PAPERS.find(p => p.id === link.source))
      .filter(p => p !== undefined) as CitationNode[];

    nodes.push(...citingPapers);

    // Add papers cited by the center paper
    const citedPapers = DEMO_LINKS
      .filter(link => link.source === centerId)
      .map(link => DEMO_PAPERS.find(p => p.id === link.target))
      .filter(p => p !== undefined) as CitationNode[];

    nodes.push(...citedPapers);

    // Add relevant links
    const nodeIds = new Set(nodes.map(n => n.id));
    links.push(...DEMO_LINKS.filter(link => 
      nodeIds.has(link.source as string) && nodeIds.has(link.target as string)
    ));

    // If depth > 1, add second-level connections
    if (depth > 1) {
      const secondLevelNodes: CitationNode[] = [];
      const secondLevelLinks: CitationLink[] = [];

      citingPapers.forEach(paper => {
        const connections = DEMO_LINKS
          .filter(link => link.source === paper.id || link.target === paper.id)
          .map(link => {
            const otherId = link.source === paper.id ? link.target : link.source;
            return DEMO_PAPERS.find(p => p.id === otherId);
          })
          .filter(p => p !== undefined && !nodeIds.has(p.id)) as CitationNode[];

        secondLevelNodes.push(...connections.slice(0, 2)); // Limit to 2 per paper
      });

      // Remove duplicates
      const uniqueSecondLevel = Array.from(new Set(secondLevelNodes.map(n => n.id)))
        .map(id => secondLevelNodes.find(n => n.id === id)!)
        .slice(0, 5); // Limit total second-level nodes

      nodes.push(...uniqueSecondLevel);

      // Add second-level links
      const allNodeIds = new Set(nodes.map(n => n.id));
      secondLevelLinks.push(...DEMO_LINKS.filter(link =>
        allNodeIds.has(link.source as string) && allNodeIds.has(link.target as string)
      ));

      links.push(...secondLevelLinks);
    }

    // Remove duplicate links
    const uniqueLinks = Array.from(new Set(links.map(l => `${l.source}-${l.target}`)))
      .map(key => links.find(l => `${l.source}-${l.target}` === key)!);

    const network: CitationNetwork = {
      id: crypto.randomUUID(),
      name: `Citations for "${centerPaper.title}"`,
      description: `Citation network with depth ${depth} centered on ${centerPaper.title}`,
      createdAt: new Date(),
      nodes: nodes,
      links: uniqueLinks,
      centerPaperId: centerId
    };

    return of(network).pipe(delay(800));
  }

  /**
   * Calculate network statistics
   */
  calculateStatistics(network: CitationNetwork): NetworkStatistics {
    const totalNodes = network.nodes.length;
    const totalLinks = network.links.length;
    
    const avgCitations = totalNodes > 0
      ? network.nodes.reduce((sum, node) => sum + node.citations, 0) / totalNodes
      : 0;

    const mostCitedPaper = network.nodes.length > 0
      ? network.nodes.reduce((max, node) => node.citations > max.citations ? node : max)
      : null;

    // Calculate network density: actual links / possible links
    const possibleLinks = totalNodes > 1 ? (totalNodes * (totalNodes - 1)) / 2 : 1;
    const networkDensity = totalLinks / possibleLinks;

    // Calculate average degree (connections per node)
    const degrees = new Map<string, number>();
    network.nodes.forEach(node => degrees.set(node.id, 0));
    
    network.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      degrees.set(sourceId, (degrees.get(sourceId) || 0) + 1);
      degrees.set(targetId, (degrees.get(targetId) || 0) + 1);
    });

    const avgDegree = totalNodes > 0
      ? Array.from(degrees.values()).reduce((sum, deg) => sum + deg, 0) / totalNodes
      : 0;

    // Simple clustering: count connected components (simplified)
    const clusters = this.countClusters(network);

    return {
      totalNodes,
      totalLinks,
      avgCitations,
      mostCitedPaper,
      networkDensity,
      clusters,
      avgDegree
    };
  }

  /**
   * Filter network based on criteria
   */
  filterNetwork(network: CitationNetwork, filter: NetworkFilter): CitationNetwork {
    let filteredNodes = [...network.nodes];

    // Filter by year
    if (filter.minYear !== undefined) {
      filteredNodes = filteredNodes.filter(n => n.year >= filter.minYear!);
    }
    if (filter.maxYear !== undefined) {
      filteredNodes = filteredNodes.filter(n => n.year <= filter.maxYear!);
    }

    // Filter by citations
    if (filter.minCitations !== undefined) {
      filteredNodes = filteredNodes.filter(n => n.citations >= filter.minCitations!);
    }
    if (filter.maxCitations !== undefined) {
      filteredNodes = filteredNodes.filter(n => n.citations <= filter.maxCitations!);
    }

    // Filter by authors
    if (filter.authors && filter.authors.length > 0) {
      filteredNodes = filteredNodes.filter(n =>
        n.authors.some(author =>
          filter.authors!.some(filterAuthor =>
            author.toLowerCase().includes(filterAuthor.toLowerCase())
          )
        )
      );
    }

    // Filter by sources
    if (filter.sources && filter.sources.length > 0) {
      filteredNodes = filteredNodes.filter(n =>
        n.source && filter.sources!.includes(n.source)
      );
    }

    // Filter links to only include nodes that passed filters
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = network.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return {
      ...network,
      nodes: filteredNodes,
      links: filteredLinks
    };
  }

  /**
   * Find shortest path between two nodes
   */
  findPath(network: CitationNetwork, fromId: string, toId: string): string[] {
    // BFS to find shortest path
    const adjList = new Map<string, string[]>();
    
    // Build adjacency list
    network.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      
      if (!adjList.has(sourceId)) adjList.set(sourceId, []);
      if (!adjList.has(targetId)) adjList.set(targetId, []);
      
      adjList.get(sourceId)!.push(targetId);
      adjList.get(targetId)!.push(sourceId); // Undirected graph
    });

    // BFS
    const queue: [string, string[]][] = [[fromId, [fromId]]];
    const visited = new Set<string>([fromId]);

    while (queue.length > 0) {
      const [current, path] = queue.shift()!;
      
      if (current === toId) {
        return path;
      }

      const neighbors = adjList.get(current) || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    return []; // No path found
  }

  /**
   * Get recommended papers based on network analysis
   */
  getRecommendations(network: CitationNetwork, count: number = 5): CitationNode[] {
    // Simple recommendation: papers with high citations not in current network
    const networkNodeIds = new Set(network.nodes.map(n => n.id));
    const recommendations = DEMO_PAPERS
      .filter(p => !networkNodeIds.has(p.id))
      .sort((a, b) => b.citations - a.citations)
      .slice(0, count);

    return recommendations;
  }

  /**
   * Export network data
   */
  exportNetwork(network: CitationNetwork, format: 'json' | 'graphml' | 'gexf'): string {
    if (format === 'json') {
      return JSON.stringify(network, null, 2);
    }

    if (format === 'graphml') {
      return this.toGraphML(network);
    }

    if (format === 'gexf') {
      return this.toGEXF(network);
    }

    throw new Error(`Unsupported export format: ${format}`);
  }

  // Private helper methods

  private saveNetworks(networks: CitationNetwork[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(networks));
  }

  private countClusters(network: CitationNetwork): number {
    // Union-Find algorithm to count connected components
    const parent = new Map<string, string>();
    
    network.nodes.forEach(node => parent.set(node.id, node.id));

    const find = (id: string): string => {
      if (parent.get(id) !== id) {
        parent.set(id, find(parent.get(id)!));
      }
      return parent.get(id)!;
    };

    const union = (id1: string, id2: string): void => {
      const root1 = find(id1);
      const root2 = find(id2);
      if (root1 !== root2) {
        parent.set(root1, root2);
      }
    };

    network.links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      union(sourceId, targetId);
    });

    const roots = new Set<string>();
    network.nodes.forEach(node => roots.add(find(node.id)));

    return roots.size;
  }

  private toGraphML(network: CitationNetwork): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n';
    xml += '  <graph id="G" edgedefault="directed">\n';

    // Nodes
    network.nodes.forEach(node => {
      xml += `    <node id="${node.id}">\n`;
      xml += `      <data key="title">${this.escapeXml(node.title)}</data>\n`;
      xml += `      <data key="year">${node.year}</data>\n`;
      xml += `      <data key="citations">${node.citations}</data>\n`;
      xml += `    </node>\n`;
    });

    // Edges
    network.links.forEach((link, i) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      xml += `    <edge id="e${i}" source="${sourceId}" target="${targetId}">\n`;
      xml += `      <data key="strength">${link.strength}</data>\n`;
      xml += `    </edge>\n`;
    });

    xml += '  </graph>\n';
    xml += '</graphml>';

    return xml;
  }

  private toGEXF(network: CitationNetwork): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<gexf xmlns="http://www.gexf.net/1.2draft" version="1.2">\n';
    xml += '  <graph mode="static" defaultedgetype="directed">\n';
    xml += '    <nodes>\n';

    network.nodes.forEach(node => {
      xml += `      <node id="${node.id}" label="${this.escapeXml(node.title)}" />\n`;
    });

    xml += '    </nodes>\n';
    xml += '    <edges>\n';

    network.links.forEach((link, i) => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      xml += `      <edge id="${i}" source="${sourceId}" target="${targetId}" weight="${link.strength}" />\n`;
    });

    xml += '    </edges>\n';
    xml += '  </graph>\n';
    xml += '</gexf>';

    return xml;
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private initializeDemoData(): void {
    const networks = this.getAllNetworks();
    if (networks.length === 0) {
      // Create a demo network on first load
      const demoNetwork: CitationNetwork = {
        id: 'demo-network-1',
        name: 'Deep Learning Foundations',
        description: 'Key papers in deep learning and neural networks',
        createdAt: new Date(),
        nodes: DEMO_PAPERS.slice(0, 5),
        links: DEMO_LINKS.filter(link => {
          const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
          const targetId = typeof link.target === 'string' ? link.target : link.target.id;
          const nodeIds = DEMO_PAPERS.slice(0, 5).map(p => p.id);
          return nodeIds.includes(sourceId) && nodeIds.includes(targetId);
        }),
        centerPaperId: 'paper-1'
      };

      this.saveNetworks([demoNetwork]);
    }
  }
}
