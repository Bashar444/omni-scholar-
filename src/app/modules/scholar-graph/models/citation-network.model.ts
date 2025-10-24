/**
 * Citation Network Data Models
 * Models for visualizing paper citation relationships
 */

export interface CitationNode {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  abstract?: string;
  doi?: string;
  url?: string;
  source?: string;
  // D3.js force simulation properties
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
}

export interface CitationLink {
  source: string | CitationNode;
  target: string | CitationNode;
  strength: number; // 0-1, based on citation count or relevance
  type: 'cites' | 'cited-by' | 'co-citation';
}

export interface CitationNetwork {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  nodes: CitationNode[];
  links: CitationLink[];
  centerPaperId: string; // The focal paper of the network
}

export interface NetworkStatistics {
  totalNodes: number;
  totalLinks: number;
  avgCitations: number;
  mostCitedPaper: CitationNode | null;
  networkDensity: number; // links / (nodes * (nodes - 1) / 2)
  clusters: number;
  avgDegree: number; // avg connections per node
}

export interface NetworkLayout {
  type: 'force' | 'hierarchical' | 'circular' | 'radial';
  config: {
    strength?: number;
    distance?: number;
    charge?: number;
    centerForce?: number;
  };
}

export interface NetworkFilter {
  minYear?: number;
  maxYear?: number;
  minCitations?: number;
  maxCitations?: number;
  authors?: string[];
  sources?: string[];
  highlightPath?: string[]; // Node IDs to highlight
}

export interface ExportFormat {
  type: 'svg' | 'png' | 'json' | 'graphml' | 'gexf';
  width?: number;
  height?: number;
  quality?: number;
}

// Demo data constants
export const DEMO_PAPERS: CitationNode[] = [
  {
    id: 'paper-1',
    title: 'Attention Is All You Need',
    authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.', 'et al.'],
    year: 2017,
    citations: 50000,
    abstract: 'We propose the Transformer, a novel neural network architecture based entirely on attention mechanisms...',
    doi: '10.48550/arXiv.1706.03762',
    source: 'arXiv'
  },
  {
    id: 'paper-2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: ['Devlin, J.', 'Chang, M.', 'Lee, K.', 'Toutanova, K.'],
    year: 2018,
    citations: 45000,
    abstract: 'We introduce BERT, a new language representation model which obtains state-of-the-art results...',
    doi: '10.48550/arXiv.1810.04805',
    source: 'arXiv'
  },
  {
    id: 'paper-3',
    title: 'GPT-3: Language Models are Few-Shot Learners',
    authors: ['Brown, T.', 'Mann, B.', 'Ryder, N.', 'et al.'],
    year: 2020,
    citations: 35000,
    abstract: 'Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus...',
    doi: '10.48550/arXiv.2005.14165',
    source: 'arXiv'
  },
  {
    id: 'paper-4',
    title: 'ImageNet Classification with Deep Convolutional Neural Networks',
    authors: ['Krizhevsky, A.', 'Sutskever, I.', 'Hinton, G.'],
    year: 2012,
    citations: 60000,
    abstract: 'We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images...',
    doi: '10.1145/3065386',
    source: 'ACM'
  },
  {
    id: 'paper-5',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['He, K.', 'Zhang, X.', 'Ren, S.', 'Sun, J.'],
    year: 2016,
    citations: 55000,
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework...',
    doi: '10.1109/CVPR.2016.90',
    source: 'IEEE'
  },
  {
    id: 'paper-6',
    title: 'Generative Adversarial Networks',
    authors: ['Goodfellow, I.', 'Pouget-Abadie, J.', 'Mirza, M.', 'et al.'],
    year: 2014,
    citations: 40000,
    abstract: 'We propose a new framework for estimating generative models via an adversarial process...',
    doi: '10.48550/arXiv.1406.2661',
    source: 'arXiv'
  },
  {
    id: 'paper-7',
    title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
    authors: ['Bahdanau, D.', 'Cho, K.', 'Bengio, Y.'],
    year: 2014,
    citations: 30000,
    abstract: 'Neural machine translation is a recently proposed approach to machine translation...',
    doi: '10.48550/arXiv.1409.0473',
    source: 'arXiv'
  },
  {
    id: 'paper-8',
    title: 'Adam: A Method for Stochastic Optimization',
    authors: ['Kingma, D.', 'Ba, J.'],
    year: 2014,
    citations: 48000,
    abstract: 'We introduce Adam, an algorithm for first-order gradient-based optimization...',
    doi: '10.48550/arXiv.1412.6980',
    source: 'arXiv'
  }
];

export const DEMO_LINKS: CitationLink[] = [
  // Transformer citations
  { source: 'paper-2', target: 'paper-1', strength: 0.9, type: 'cites' }, // BERT cites Attention
  { source: 'paper-3', target: 'paper-1', strength: 0.9, type: 'cites' }, // GPT-3 cites Attention
  { source: 'paper-2', target: 'paper-7', strength: 0.7, type: 'cites' }, // BERT cites Bahdanau
  { source: 'paper-3', target: 'paper-2', strength: 0.8, type: 'cites' }, // GPT-3 cites BERT
  
  // Computer vision citations
  { source: 'paper-5', target: 'paper-4', strength: 0.9, type: 'cites' }, // ResNet cites AlexNet
  { source: 'paper-6', target: 'paper-4', strength: 0.6, type: 'cites' }, // GANs cite AlexNet
  
  // Optimization citations
  { source: 'paper-1', target: 'paper-8', strength: 0.8, type: 'cites' }, // Attention cites Adam
  { source: 'paper-2', target: 'paper-8', strength: 0.8, type: 'cites' }, // BERT cites Adam
  { source: 'paper-5', target: 'paper-8', strength: 0.8, type: 'cites' }, // ResNet cites Adam
  
  // Cross-domain citations
  { source: 'paper-6', target: 'paper-5', strength: 0.5, type: 'cites' }, // GANs cite ResNet
  { source: 'paper-7', target: 'paper-4', strength: 0.4, type: 'cites' }, // Bahdanau cites AlexNet
];

export const LAYOUT_PRESETS: Record<NetworkLayout['type'], NetworkLayout['config']> = {
  force: {
    strength: 0.7,
    distance: 100,
    charge: -300,
    centerForce: 0.1
  },
  hierarchical: {
    strength: 0.5,
    distance: 150,
    charge: -200,
    centerForce: 0.05
  },
  circular: {
    strength: 0.3,
    distance: 80,
    charge: -150,
    centerForce: 0.2
  },
  radial: {
    strength: 0.6,
    distance: 120,
    charge: -250,
    centerForce: 0.15
  }
};
