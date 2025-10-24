// Core study and replication models
export interface Study {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal: string;
  doi: string;
  abstract: string;
  methodology: string;
  findings: string[];
  sampleSize: number;
  field: ResearchField;
  status: StudyStatus;
  reproducibilityScore: number; // 0-100
  replicationCount: number;
  protocols: Protocol[];
  dataAvailable: boolean;
  codeAvailable: boolean;
  preregistered: boolean;
  openAccess: boolean;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

export type ResearchField = 
  | 'Psychology'
  | 'Neuroscience'
  | 'Medicine'
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Computer Science'
  | 'Social Sciences'
  | 'Economics'
  | 'Other';

export type StudyStatus = 
  | 'Original'
  | 'Replicated'
  | 'Failed Replication'
  | 'Partially Replicated'
  | 'Pending Replication';

export type BadgeType = 
  | 'Open Data'
  | 'Open Materials'
  | 'Preregistered'
  | 'Replicated'
  | 'Reproducible'
  | 'Open Access';

export interface Badge {
  type: BadgeType;
  awardedDate: Date;
  verifiedBy: string;
}

export interface Protocol {
  id: string;
  version: string;
  title: string;
  description: string;
  steps: ProtocolStep[];
  equipment: string[];
  materials: string[];
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  author: string;
  createdAt: Date;
  lastModified: Date;
}

export interface ProtocolStep {
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  criticalPoint: boolean;
  notes: string;
}

export interface ReplicationStudy {
  id: string;
  originalStudyId: string;
  originalStudy: Study;
  replicatingTeam: string[];
  institution: string;
  status: ReplicationStatus;
  outcome: ReplicationOutcome;
  sampleSize: number;
  methodology: string;
  findings: string[];
  deviations: string[];
  confidence: number; // 0-100
  effectSizeComparison: EffectSizeComparison;
  startDate: Date;
  completionDate?: Date;
  preregistrationUrl?: string;
  dataUrl?: string;
  codeUrl?: string;
  reportUrl?: string;
  notes: string;
}

export type ReplicationStatus = 
  | 'Planned'
  | 'In Progress'
  | 'Data Collection'
  | 'Analysis'
  | 'Completed'
  | 'Published'
  | 'Abandoned';

export type ReplicationOutcome = 
  | 'Successful'
  | 'Failed'
  | 'Partial'
  | 'Inconclusive'
  | 'Pending';

export interface EffectSizeComparison {
  original: number;
  replication: number;
  difference: number;
  percentageDifference: number;
  withinCI: boolean; // Within confidence interval
}

export interface MetaAnalysis {
  id: string;
  title: string;
  description: string;
  researchQuestion: string;
  studies: Study[];
  totalStudies: number;
  totalParticipants: number;
  averageEffectSize: number;
  confidenceInterval: [number, number];
  heterogeneity: number; // I² statistic
  publicationBias: 'Low' | 'Medium' | 'High';
  qualityScore: number; // 0-100
  forestPlotData: ForestPlotData[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface ForestPlotData {
  studyName: string;
  effectSize: number;
  lowerCI: number;
  upperCI: number;
  weight: number;
}

export interface ValidationNetwork {
  id: string;
  centralStudyId: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  overallConfidence: number;
}

export interface NetworkNode {
  id: string;
  studyId: string;
  studyTitle: string;
  authors: string;
  year: number;
  type: 'Original' | 'Replication' | 'Extension';
  outcome: ReplicationOutcome;
  size: number; // Visual size based on impact
}

export interface NetworkEdge {
  source: string;
  target: string;
  relationship: 'Replicates' | 'Extends' | 'Contradicts' | 'Supports';
  confidence: number;
}

export interface ReproducibilityMetrics {
  totalStudies: number;
  replicatedStudies: number;
  failedReplications: number;
  averageReproducibilityScore: number;
  openDataPercentage: number;
  openCodePercentage: number;
  preregisteredPercentage: number;
  byField: Record<ResearchField, FieldMetrics>;
  trendOverTime: YearlyTrend[];
}

export interface FieldMetrics {
  totalStudies: number;
  successRate: number;
  averageScore: number;
}

export interface YearlyTrend {
  year: number;
  totalStudies: number;
  successfulReplications: number;
  successRate: number;
}

export interface ProtocolComparison {
  originalProtocol: Protocol;
  replicationProtocol: Protocol;
  differences: ProtocolDifference[];
  similarityScore: number; // 0-100
}

export interface ProtocolDifference {
  section: 'Steps' | 'Equipment' | 'Materials' | 'Duration';
  type: 'Added' | 'Removed' | 'Modified';
  description: string;
  impact: 'Critical' | 'Moderate' | 'Minor';
}

// Mock data
export const MOCK_STUDIES: Study[] = [
  {
    id: 's1',
    title: 'Ego Depletion and Self-Control: A Meta-Analysis',
    authors: ['Baumeister, R.F.', 'Vohs, K.D.', 'Tice, D.M.'],
    year: 2007,
    journal: 'Psychological Bulletin',
    doi: '10.1037/0033-2909.133.1.65',
    abstract: 'A meta-analysis of ego depletion effects on subsequent self-control performance.',
    methodology: 'Sequential task paradigm',
    findings: [
      'Ego depletion significantly impairs subsequent self-control',
      'Effect size d = 0.62',
      'Effect moderated by task difficulty'
    ],
    sampleSize: 83,
    field: 'Psychology',
    status: 'Replicated',
    reproducibilityScore: 72,
    replicationCount: 15,
    protocols: [],
    dataAvailable: true,
    codeAvailable: false,
    preregistered: false,
    openAccess: true,
    badges: [
      { type: 'Open Data', awardedDate: new Date('2020-03-15'), verifiedBy: 'OSF' },
      { type: 'Replicated', awardedDate: new Date('2021-06-20'), verifiedBy: 'Replication Network' }
    ],
    createdAt: new Date('2019-01-10'),
    updatedAt: new Date('2023-11-05')
  },
  {
    id: 's2',
    title: 'Power Posing: Brief Nonverbal Displays Affect Neuroendocrine Levels',
    authors: ['Carney, D.R.', 'Cuddy, A.J.', 'Yap, A.J.'],
    year: 2010,
    journal: 'Psychological Science',
    doi: '10.1177/0956797610383437',
    abstract: 'High-power poses increase testosterone and decrease cortisol.',
    methodology: 'Experimental manipulation of body posture',
    findings: [
      'Power poses increase testosterone by 20%',
      'Power poses decrease cortisol by 25%',
      'Poses affect risk-taking behavior'
    ],
    sampleSize: 42,
    field: 'Psychology',
    status: 'Failed Replication',
    reproducibilityScore: 35,
    replicationCount: 8,
    protocols: [],
    dataAvailable: true,
    codeAvailable: true,
    preregistered: false,
    openAccess: true,
    badges: [
      { type: 'Open Data', awardedDate: new Date('2019-05-10'), verifiedBy: 'OSF' },
      { type: 'Open Materials', awardedDate: new Date('2019-05-10'), verifiedBy: 'OSF' }
    ],
    createdAt: new Date('2018-06-15'),
    updatedAt: new Date('2023-09-20')
  },
  {
    id: 's3',
    title: 'CRISPR-Cas9 Gene Editing in Human Embryos',
    authors: ['Ma, H.', 'Marti-Gutierrez, N.', 'Park, S.W.'],
    year: 2017,
    journal: 'Nature',
    doi: '10.1038/nature23305',
    abstract: 'Correction of a pathogenic gene mutation in human embryos.',
    methodology: 'CRISPR-Cas9 targeting of MYBPC3 gene',
    findings: [
      'High efficiency of gene correction (72.4%)',
      'No off-target effects detected',
      'Mosaicism reduced compared to previous studies'
    ],
    sampleSize: 58,
    field: 'Biology',
    status: 'Replicated',
    reproducibilityScore: 88,
    replicationCount: 12,
    protocols: [],
    dataAvailable: true,
    codeAvailable: true,
    preregistered: true,
    openAccess: true,
    badges: [
      { type: 'Open Data', awardedDate: new Date('2017-08-02'), verifiedBy: 'Nature' },
      { type: 'Open Materials', awardedDate: new Date('2017-08-02'), verifiedBy: 'Nature' },
      { type: 'Preregistered', awardedDate: new Date('2017-08-02'), verifiedBy: 'ClinicalTrials.gov' },
      { type: 'Replicated', awardedDate: new Date('2020-11-15'), verifiedBy: 'Replication Network' },
      { type: 'Reproducible', awardedDate: new Date('2021-03-10'), verifiedBy: 'Peer Review' }
    ],
    createdAt: new Date('2017-08-02'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 's4',
    title: 'Growth Mindset Intervention Improves Academic Achievement',
    authors: ['Yeager, D.S.', 'Dweck, C.S.'],
    year: 2019,
    journal: 'Nature',
    doi: '10.1038/s41586-019-1466-y',
    abstract: 'A brief online growth mindset intervention raises grades among lower-achieving students.',
    methodology: 'Randomized controlled trial',
    findings: [
      'Significant improvement in GPA for lower-achieving students',
      'Effect size d = 0.11',
      'No effect for higher-achieving students'
    ],
    sampleSize: 12490,
    field: 'Psychology',
    status: 'Partially Replicated',
    reproducibilityScore: 65,
    replicationCount: 6,
    protocols: [],
    dataAvailable: true,
    codeAvailable: true,
    preregistered: true,
    openAccess: true,
    badges: [
      { type: 'Open Data', awardedDate: new Date('2019-08-09'), verifiedBy: 'OSF' },
      { type: 'Open Materials', awardedDate: new Date('2019-08-09'), verifiedBy: 'OSF' },
      { type: 'Preregistered', awardedDate: new Date('2019-08-09'), verifiedBy: 'OSF' }
    ],
    createdAt: new Date('2019-08-09'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 's5',
    title: 'Quantum Supremacy Using a Programmable Superconducting Processor',
    authors: ['Arute, F.', 'Arya, K.', 'Babbush, R.'],
    year: 2019,
    journal: 'Nature',
    doi: '10.1038/s41586-019-1666-5',
    abstract: 'Demonstration of quantum computational advantage.',
    methodology: 'Sycamore processor with 53 qubits',
    findings: [
      'Quantum processor completes task in 200 seconds',
      'Classical supercomputer would take 10,000 years',
      'Demonstrates quantum supremacy'
    ],
    sampleSize: 1,
    field: 'Physics',
    status: 'Pending Replication',
    reproducibilityScore: 78,
    replicationCount: 2,
    protocols: [],
    dataAvailable: true,
    codeAvailable: true,
    preregistered: false,
    openAccess: true,
    badges: [
      { type: 'Open Data', awardedDate: new Date('2019-10-23'), verifiedBy: 'Nature' },
      { type: 'Open Materials', awardedDate: new Date('2019-10-23'), verifiedBy: 'Nature' }
    ],
    createdAt: new Date('2019-10-23'),
    updatedAt: new Date('2024-02-15')
  }
];

export const MOCK_REPLICATIONS: ReplicationStudy[] = [
  {
    id: 'r1',
    originalStudyId: 's1',
    originalStudy: MOCK_STUDIES[0],
    replicatingTeam: ['Hagger, M.S.', 'Chatzisarantis, N.L.', 'Alberts, H.'],
    institution: 'Curtin University',
    status: 'Published',
    outcome: 'Partial',
    sampleSize: 2141,
    methodology: 'Multi-lab registered replication',
    findings: [
      'Small effect size found (d = 0.04)',
      'Not statistically significant',
      'Original effect likely overestimated'
    ],
    deviations: [
      'Larger sample size',
      'Pre-registered design',
      'Multiple labs'
    ],
    confidence: 68,
    effectSizeComparison: {
      original: 0.62,
      replication: 0.04,
      difference: -0.58,
      percentageDifference: -93.5,
      withinCI: false
    },
    startDate: new Date('2014-01-15'),
    completionDate: new Date('2016-07-20'),
    preregistrationUrl: 'https://osf.io/jymhe',
    dataUrl: 'https://osf.io/jymhe/files/',
    codeUrl: 'https://github.com/replications/ego-depletion',
    reportUrl: 'https://journals.sagepub.com/doi/10.1177/1745691616652873',
    notes: 'Large-scale replication with improved methodology'
  },
  {
    id: 'r2',
    originalStudyId: 's2',
    originalStudy: MOCK_STUDIES[1],
    replicatingTeam: ['Ranehill, E.', 'Dreber, A.', 'Johannesson, M.'],
    institution: 'Stockholm School of Economics',
    status: 'Published',
    outcome: 'Failed',
    sampleSize: 200,
    methodology: 'Direct replication with hormonal assays',
    findings: [
      'No significant effect on testosterone',
      'No significant effect on cortisol',
      'No effect on risk-taking'
    ],
    deviations: [
      'Larger sample size',
      'Double-blind design',
      'More sensitive hormone assays'
    ],
    confidence: 35,
    effectSizeComparison: {
      original: 0.74,
      replication: 0.02,
      difference: -0.72,
      percentageDifference: -97.3,
      withinCI: false
    },
    startDate: new Date('2012-05-10'),
    completionDate: new Date('2015-09-15'),
    preregistrationUrl: 'https://osf.io/p2k4v',
    dataUrl: 'https://osf.io/p2k4v/files/',
    codeUrl: 'https://github.com/replications/power-poses',
    reportUrl: 'https://doi.org/10.1177/0956797614553946',
    notes: 'Failed to replicate hormone effects'
  }
];
