import { Component, OnInit, OnDestroy, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as d3 from 'd3';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { SliderModule } from 'primeng/slider';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { 
  CitationNode, 
  CitationLink, 
  CitationNetwork, 
  NetworkStatistics,
  NetworkLayout,
  NetworkFilter,
  LAYOUT_PRESETS,
  DEMO_PAPERS
} from './models/citation-network.model';
import { CitationNetworkService } from './services/citation-network.service';

@Component({
  selector: 'app-citation-network',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    DropdownModule,
    TooltipModule,
    SliderModule,
    MenuModule,
    ChipsModule,
    DividerModule
  ],
  templateUrl: './citation-network.component.html',
  styleUrls: ['./citation-network.component.scss']
})
export class CitationNetworkComponent implements OnInit, OnDestroy {
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<HTMLDivElement>;

  // State
  currentNetwork = signal<CitationNetwork | null>(null);
  statistics = signal<NetworkStatistics | null>(null);
  selectedNode = signal<CitationNode | null>(null);
  highlightedPath = signal<string[]>([]);
  isLoading = signal(false);

  // Settings
  layoutType = signal<NetworkLayout['type']>('force');
  zoomLevel = signal(1);
  showLabels = signal(true);
  nodeSize = 8; // Regular property for two-way binding with mat-slider

  // Filter
  filter = signal<NetworkFilter>({});

  // Computed
  filteredNetwork = computed(() => {
    const network = this.currentNetwork();
    const currentFilter = this.filter();
    if (!network || Object.keys(currentFilter).length === 0) {
      return network;
    }
    return this.networkService.filterNetwork(network, currentFilter);
  });

  // D3.js simulation
  private svg: any;
  private simulation: any;
  private node: any;
  private link: any;
  private label: any;
  private width = 1200;
  private height = 800;

  // Demo papers for building networks
  demoPapers = DEMO_PAPERS;
  selectedPaperId = signal<string>(DEMO_PAPERS[0].id);
  
  // Export menu items
  exportMenuItems: MenuItem[] = [
    {
      label: 'Export as SVG',
      icon: 'pi pi-image',
      command: () => this.exportSVG()
    },
    {
      label: 'Export as PNG',
      icon: 'pi pi-file-image',
      command: () => this.exportPNG()
    },
    {
      label: 'Export as JSON',
      icon: 'pi pi-code',
      command: () => this.exportJSON()
    }
  ];

  constructor(private networkService: CitationNetworkService) {}

  ngOnInit() {
    this.initializeSVG();
    this.loadDemoNetwork();
  }

  ngOnDestroy() {
    if (this.simulation) {
      this.simulation.stop();
    }
  }

  /**
   * Initialize D3.js SVG canvas
   */
  private initializeSVG() {
    const container = this.svgContainer.nativeElement;
    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height || 800;

    // Create SVG
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', [0, 0, this.width, this.height])
      .call(d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 10])
        .on('zoom', (event) => {
          this.svg.select('.graph-container').attr('transform', event.transform);
          this.zoomLevel.set(event.transform.k);
        })
      );

    // Create container for graph elements
    this.svg.append('g').attr('class', 'graph-container');
  }

  /**
   * Load demo network
   */
  private loadDemoNetwork() {
    this.isLoading.set(true);
    const networks = this.networkService.getAllNetworks();
    
    if (networks.length > 0) {
      this.currentNetwork.set(networks[0]);
      this.updateStatistics();
      this.renderNetwork();
      this.isLoading.set(false);
    }
  }

  /**
   * Build new network from selected paper
   */
  buildNetwork(depth: number = 2) {
    this.isLoading.set(true);
    const paperId = this.selectedPaperId();

    this.networkService.buildNetwork(paperId, depth).subscribe(network => {
      this.currentNetwork.set(network);
      this.updateStatistics();
      this.renderNetwork();
      this.isLoading.set(false);
    });
  }

  /**
   * Render the network graph using D3.js force simulation
   */
  private renderNetwork() {
    const network = this.filteredNetwork();
    if (!network) return;

    const container = this.svg.select('.graph-container');
    container.selectAll('*').remove();

    // Create force simulation
    const layoutConfig = LAYOUT_PRESETS[this.layoutType()];
    
    this.simulation = d3.forceSimulation(network.nodes)
      .force('link', d3.forceLink(network.links)
        .id((d: any) => d.id)
        .distance(layoutConfig.distance ?? 100)
        .strength(layoutConfig.strength ?? 0.7)
      )
      .force('charge', d3.forceManyBody().strength(layoutConfig.charge ?? -300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2).strength(layoutConfig.centerForce ?? 0.1))
      .force('collision', d3.forceCollide().radius(30));

    // Create links
    this.link = container.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(network.links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: CitationLink) => Math.sqrt(d.strength * 3));

    // Create nodes
    this.node = container.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(network.nodes)
      .join('circle')
      .attr('class', 'node')
      .attr('r', (d: CitationNode) => {
        const baseSize = this.nodeSize;
        const citationScale = Math.log(d.citations + 1) / Math.log(60000);
        return baseSize + citationScale * 12;
      })
      .attr('fill', (d: CitationNode) => {
        if (d.id === network.centerPaperId) return '#3F51B5'; // Primary
        if (this.highlightedPath().includes(d.id)) return '#FF9800'; // Orange
        return '#2196F3'; // Blue
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(this.drag(this.simulation) as any)
      .on('click', (event: MouseEvent, d: CitationNode) => {
        this.onNodeClick(d);
      })
      .on('mouseover', (event: MouseEvent, d: CitationNode) => {
        this.onNodeHover(d, true);
      })
      .on('mouseout', (event: MouseEvent, d: CitationNode) => {
        this.onNodeHover(d, false);
      });

    // Create labels
    if (this.showLabels()) {
      this.label = container.append('g')
        .attr('class', 'labels')
        .selectAll('text')
        .data(network.nodes)
        .join('text')
        .attr('class', 'label')
        .attr('text-anchor', 'middle')
        .attr('dy', -15)
        .attr('font-size', '10px')
        .attr('fill', '#333')
        .text((d: CitationNode) => {
          const title = d.title;
          return title.length > 30 ? title.substring(0, 30) + '...' : title;
        });
    }

    // Update positions on simulation tick
    this.simulation.on('tick', () => {
      this.link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      this.node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      if (this.label) {
        this.label
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y);
      }
    });
  }

  /**
   * Drag behavior for nodes
   */
  private drag(simulation: any) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  /**
   * Handle node click
   */
  private onNodeClick(node: CitationNode) {
    this.selectedNode.set(node);
  }

  /**
   * Handle node hover
   */
  private onNodeHover(node: CitationNode, isHovering: boolean) {
    if (isHovering) {
      // Highlight node and connected links
      this.node
        .attr('opacity', (d: CitationNode) => 
          d.id === node.id || this.isConnected(d.id, node.id) ? 1 : 0.3
        );

      this.link
        .attr('stroke-opacity', (d: CitationLink) => {
          const sourceId = typeof d.source === 'string' ? d.source : d.source.id;
          const targetId = typeof d.target === 'string' ? d.target : d.target.id;
          return sourceId === node.id || targetId === node.id ? 1 : 0.1;
        });
    } else {
      // Reset
      this.node.attr('opacity', 1);
      this.link.attr('stroke-opacity', 0.6);
    }
  }

  /**
   * Check if two nodes are connected
   */
  private isConnected(nodeId1: string, nodeId2: string): boolean {
    const network = this.filteredNetwork();
    if (!network) return false;

    return network.links.some(link => {
      const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
      const targetId = typeof link.target === 'string' ? link.target : link.target.id;
      return (sourceId === nodeId1 && targetId === nodeId2) ||
             (sourceId === nodeId2 && targetId === nodeId1);
    });
  }

  /**
   * Update network statistics
   */
  private updateStatistics() {
    const network = this.currentNetwork();
    if (!network) return;

    const stats = this.networkService.calculateStatistics(network);
    this.statistics.set(stats);
  }

  /**
   * Change layout type
   */
  changeLayout(type: NetworkLayout['type']) {
    this.layoutType.set(type);
    this.renderNetwork();
  }

  /**
   * Toggle labels
   */
  toggleLabels() {
    this.showLabels.set(!this.showLabels());
    this.renderNetwork();
  }

  /**
   * Adjust node size
   */
  adjustNodeSize(size: number): void {
    this.nodeSize = size;
    this.renderNetwork();
  }

  /**
   * Find and highlight path between selected node and center
   */
  highlightPath() {
    const network = this.currentNetwork();
    const selected = this.selectedNode();
    
    if (!network || !selected || selected.id === network.centerPaperId) {
      this.highlightedPath.set([]);
      this.renderNetwork();
      return;
    }

    const path = this.networkService.findPath(network, network.centerPaperId, selected.id);
    this.highlightedPath.set(path);
    this.renderNetwork();
  }

  /**
   * Clear selection
   */
  clearSelection() {
    this.selectedNode.set(null);
    this.highlightedPath.set([]);
    this.renderNetwork();
  }

  /**
   * Export network as SVG
   */
  exportSVG() {
    const svgElement = this.svg.node();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'citation-network.svg';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Export network as PNG
   */
  exportPNG() {
    const svgElement = this.svg.node();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d')!;
    
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(blob => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'citation-network.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  }

  /**
   * Export network data as JSON
   */
  exportJSON() {
    const network = this.currentNetwork();
    if (!network) return;

    const json = this.networkService.exportNetwork(network, 'json');
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'citation-network.json';
    link.click();
    
    URL.revokeObjectURL(url);
  }

  /**
   * Reset zoom
   */
  resetZoom() {
    this.svg.transition()
      .duration(750)
      .call(
        d3.zoom<SVGSVGElement, unknown>().transform,
        d3.zoomIdentity
      );
  }

  /**
   * Format number with K/M suffix
   */
  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  /**
   * Format percentage
   */
  formatPercent(num: number): string {
    return (num * 100).toFixed(1) + '%';
  }
}
