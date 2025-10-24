// ============================================================================
// TrustLayer Models - Verification & Provenance System
// ============================================================================

// Blockchain and Verification Models
export interface VerificationRecord {
  id: string;
  entityId: string; // Paper, Dataset, or Code ID
  entityType: VerificationType;
  blockchainHash: string;
  transactionId: string;
  timestamp: Date;
  verifier: string;
  verifierOrganization?: string;
  verificationMethod: VerificationMethod;
  status: VerificationStatus;
  metadata: VerificationMetadata;
  signatures: DigitalSignature[];
  certificate?: VerificationCertificate;
  expiryDate?: Date;
  renewalRequired: boolean;
}

export interface VerificationMetadata {
  originalHash: string;
  fileSize?: number;
  fileType?: string;
  checksumAlgorithm: string;
  integrityScore: number; // 0-100
  tamperProofSeal: string;
  additionalInfo?: Record<string, any>;
}

export interface DigitalSignature {
  signerId: string;
  signerName: string;
  signerRole: string;
  signature: string;
  algorithm: string;
  timestamp: Date;
  publicKey: string;
}

export interface VerificationCertificate {
  certificateId: string;
  issuedBy: string;
  issuedTo: string;
  issuedAt: Date;
  validUntil: Date;
  certificateType: string;
  qrCode?: string;
  verificationUrl: string;
}

// Data Lineage and Provenance Models
export interface DataLineage {
  id: string;
  datasetId: string;
  datasetName: string;
  owner: string;
  createdAt: Date;
  lastModified: Date;
  lineageGraph: LineageNode[];
  transformations: DataTransformation[];
  dependencies: DataDependency[];
  confidenceScore: number; // 0-100
  isComplete: boolean;
}

export interface LineageNode {
  id: string;
  type: NodeType;
  name: string;
  description: string;
  timestamp: Date;
  metadata: Record<string, any>;
  inputs: string[]; // Node IDs
  outputs: string[]; // Node IDs
  operation?: string;
}

export interface DataTransformation {
  id: string;
  name: string;
  type: TransformationType;
  description: string;
  appliedBy: string;
  appliedAt: Date;
  inputData: string[];
  outputData: string[];
  script?: string;
  parameters?: Record<string, any>;
  reproducible: boolean;
}

export interface DataDependency {
  id: string;
  sourceId: string;
  sourceName: string;
  targetId: string;
  targetName: string;
  dependencyType: DependencyType;
  strength: number; // 0-100
  description: string;
  verified: boolean;
}

// Peer Verification Models
export interface PeerVerification {
  id: string;
  subjectId: string; // Paper, Data, or Code ID
  subjectType: VerificationType;
  subjectTitle: string;
  verifierId: string;
  verifierName: string;
  verifierCredentials: VerifierCredentials;
  verificationDate: Date;
  result: VerificationResult;
  confidence: number; // 0-100
  methodology: string;
  findings: VerificationFinding[];
  recommendations: string[];
  status: VerificationStatus;
  reviewDuration: number; // in hours
  badge?: TrustBadge;
}

export interface VerifierCredentials {
  orcid?: string;
  hIndex: number;
  publications: number;
  citations: number;
  verificationCount: number;
  expertiseAreas: string[];
  certifications: string[];
  reputation: number; // 0-100
}

export interface VerificationFinding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  title: string;
  description: string;
  location?: string;
  evidence?: string;
  suggestion?: string;
}

export interface TrustBadge {
  id: string;
  type: BadgeType;
  level: BadgeLevel;
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  icon: string;
  color: string;
  description: string;
}

// Reputation System Models
export interface ReputationProfile {
  userId: string;
  userName: string;
  overallScore: number; // 0-1000
  level: ReputationLevel;
  rank: number;
  badges: TrustBadge[];
  metrics: ReputationMetrics;
  history: ReputationEvent[];
  achievements: Achievement[];
  endorsements: Endorsement[];
  verifiedIdentity: boolean;
  lastUpdated: Date;
}

export interface ReputationMetrics {
  publicationsVerified: number;
  datasetsVerified: number;
  codeVerified: number;
  peerReviewsCompleted: number;
  collaborations: number;
  citations: number;
  reproducibilityRate: number; // percentage
  dataIntegrityScore: number; // 0-100
  communityContributions: number;
  timeActive: number; // in days
}

export interface ReputationEvent {
  id: string;
  type: ReputationEventType;
  action: string;
  points: number; // can be positive or negative
  timestamp: Date;
  description: string;
  relatedEntity?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  unlockedAt: Date;
  progress: number; // 0-100
  requirement: string;
}

export interface Endorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  endorserReputation: number;
  skill: string;
  comment?: string;
  timestamp: Date;
  verified: boolean;
}

// Fraud Detection Models
export interface FraudAlert {
  id: string;
  entityId: string;
  entityType: VerificationType;
  entityTitle: string;
  alertType: FraudAlertType;
  severity: FindingSeverity;
  confidence: number; // 0-100
  detectedAt: Date;
  detectionMethod: string;
  indicators: FraudIndicator[];
  status: AlertStatus;
  investigator?: string;
  resolution?: string;
  resolvedAt?: Date;
}

export interface FraudIndicator {
  id: string;
  type: string;
  description: string;
  evidence: string;
  weight: number; // 0-100
  automated: boolean;
}

// Citation Verification Models
export interface CitationVerification {
  id: string;
  paperId: string;
  paperTitle: string;
  citations: VerifiedCitation[];
  totalCitations: number;
  verifiedCitations: number;
  unverifiedCitations: number;
  suspiciousCitations: number;
  accuracy: number; // percentage
  lastChecked: Date;
  issues: CitationIssue[];
}

export interface VerifiedCitation {
  id: string;
  citingPaper: string;
  citingPaperTitle: string;
  citedPaper: string;
  citedPaperTitle: string;
  context: string;
  isAccurate: boolean;
  isSelfCitation: boolean;
  relevanceScore: number; // 0-100
  verifiedAt: Date;
  issues: string[];
}

export interface CitationIssue {
  id: string;
  type: CitationIssueType;
  description: string;
  citationId: string;
  severity: FindingSeverity;
  suggestion: string;
}

// Type Unions and Enums
export type VerificationType = 'paper' | 'dataset' | 'code' | 'methodology' | 'result' | 'claim';
export type VerificationMethod = 'blockchain' | 'peer-review' | 'automated' | 'manual' | 'hybrid';
export type VerificationStatus = 'pending' | 'in-progress' | 'verified' | 'rejected' | 'expired' | 'under-review';
export type VerificationResult = 'verified' | 'partially-verified' | 'unverified' | 'disputed' | 'fraudulent';

export type NodeType = 'source' | 'transformation' | 'output' | 'intermediate' | 'external';
export type TransformationType = 'cleaning' | 'aggregation' | 'filtering' | 'normalization' | 'enrichment' | 'analysis';
export type DependencyType = 'derived-from' | 'uses' | 'references' | 'extends' | 'replaces' | 'validates';

export type FindingCategory = 'methodology' | 'data-quality' | 'reproducibility' | 'ethics' | 'plagiarism' | 'statistics';
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type BadgeType = 'verified' | 'trusted' | 'expert' | 'pioneer' | 'guardian' | 'mentor';
export type BadgeLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export type ReputationLevel = 'novice' | 'contributor' | 'expert' | 'authority' | 'legend';
export type ReputationEventType = 'verification' | 'review' | 'contribution' | 'citation' | 'endorsement' | 'penalty';
export type AchievementCategory = 'verification' | 'collaboration' | 'quality' | 'impact' | 'community';

export type FraudAlertType = 'data-manipulation' | 'plagiarism' | 'fabrication' | 'citation-fraud' | 'duplicate-publication' | 'image-manipulation';
export type AlertStatus = 'open' | 'investigating' | 'confirmed' | 'dismissed' | 'resolved';

export type CitationIssueType = 'incorrect' | 'missing-context' | 'misattribution' | 'self-citation-abuse' | 'outdated';

// Mock Data
export const MOCK_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'ver_1',
    entityId: 'paper_123',
    entityType: 'paper',
    blockchainHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
    transactionId: 'tx_a1b2c3d4e5f6',
    timestamp: new Date('2024-10-15T14:30:00'),
    verifier: 'Dr. Sarah Johnson',
    verifierOrganization: 'Harvard University',
    verificationMethod: 'blockchain',
    status: 'verified',
    metadata: {
      originalHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      fileSize: 2048576,
      fileType: 'PDF',
      checksumAlgorithm: 'SHA-256',
      integrityScore: 98,
      tamperProofSeal: 'SEALED-2024-10-15'
    },
    signatures: [],
    renewalRequired: false
  },
  {
    id: 'ver_2',
    entityId: 'dataset_456',
    entityType: 'dataset',
    blockchainHash: '0x3c9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91744',
    transactionId: 'tx_g7h8i9j0k1l2',
    timestamp: new Date('2024-10-18T09:15:00'),
    verifier: 'Prof. Michael Chen',
    verifierOrganization: 'MIT',
    verificationMethod: 'hybrid',
    status: 'verified',
    metadata: {
      originalHash: 'sha256:b3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b900',
      fileSize: 15728640,
      fileType: 'CSV',
      checksumAlgorithm: 'SHA-256',
      integrityScore: 95,
      tamperProofSeal: 'SEALED-2024-10-18'
    },
    signatures: [],
    renewalRequired: false
  }
];

export const MOCK_PEER_VERIFICATIONS: PeerVerification[] = [
  {
    id: 'peer_1',
    subjectId: 'paper_789',
    subjectType: 'paper',
    subjectTitle: 'Novel Approach to Quantum Entanglement in Biological Systems',
    verifierId: 'user_101',
    verifierName: 'Dr. Emily Rodriguez',
    verifierCredentials: {
      orcid: '0000-0002-1234-5678',
      hIndex: 42,
      publications: 87,
      citations: 3421,
      verificationCount: 34,
      expertiseAreas: ['Quantum Biology', 'Biophysics', 'Molecular Dynamics'],
      certifications: ['Certified Peer Reviewer', 'Data Quality Specialist'],
      reputation: 92
    },
    verificationDate: new Date('2024-10-12'),
    result: 'verified',
    confidence: 88,
    methodology: 'Comprehensive peer review including methodology validation, statistical analysis verification, and reproducibility testing',
    findings: [
      {
        id: 'find_1',
        category: 'methodology',
        severity: 'low',
        title: 'Minor methodological clarification needed',
        description: 'The experimental setup could benefit from additional details about temperature control.',
        location: 'Section 2.3',
        suggestion: 'Add specific temperature ranges and control mechanisms'
      }
    ],
    recommendations: [
      'Include supplementary materials with raw data',
      'Consider cross-validation with alternative quantum measurement techniques'
    ],
    status: 'verified',
    reviewDuration: 18,
    badge: {
      id: 'badge_1',
      type: 'verified',
      level: 'gold',
      issuedBy: 'TrustLayer System',
      issuedAt: new Date('2024-10-12'),
      icon: 'verified',
      color: '#FFD700',
      description: 'Gold Verified - High Confidence Verification'
    }
  }
];

export const MOCK_REPUTATION_PROFILES: ReputationProfile[] = [
  {
    userId: 'user_101',
    userName: 'Dr. Emily Rodriguez',
    overallScore: 847,
    level: 'authority',
    rank: 23,
    badges: [],
    metrics: {
      publicationsVerified: 12,
      datasetsVerified: 8,
      codeVerified: 5,
      peerReviewsCompleted: 34,
      collaborations: 47,
      citations: 3421,
      reproducibilityRate: 94,
      dataIntegrityScore: 96,
      communityContributions: 89,
      timeActive: 487
    },
    history: [],
    achievements: [
      {
        id: 'ach_1',
        name: 'Verification Champion',
        description: 'Completed 25+ peer verifications',
        icon: 'verified_user',
        category: 'verification',
        unlockedAt: new Date('2024-08-15'),
        progress: 100,
        requirement: 'Complete 25 peer verifications'
      },
      {
        id: 'ach_2',
        name: 'Data Guardian',
        description: 'Verified 10+ datasets with high accuracy',
        icon: 'shield',
        category: 'quality',
        unlockedAt: new Date('2024-09-20'),
        progress: 100,
        requirement: 'Verify 10 datasets with 90%+ accuracy'
      }
    ],
    endorsements: [],
    verifiedIdentity: true,
    lastUpdated: new Date('2024-10-22')
  }
];

export const MOCK_FRAUD_ALERTS: FraudAlert[] = [
  {
    id: 'alert_1',
    entityId: 'paper_999',
    entityType: 'paper',
    entityTitle: 'Revolutionary Cancer Treatment Study',
    alertType: 'data-manipulation',
    severity: 'high',
    confidence: 87,
    detectedAt: new Date('2024-10-20'),
    detectionMethod: 'Automated statistical anomaly detection',
    indicators: [
      {
        id: 'ind_1',
        type: 'Statistical Anomaly',
        description: 'Unusual distribution pattern in control group data suggests possible manipulation',
        evidence: 'P-value clustering near 0.05, unrealistic uniformity in measurements',
        weight: 85,
        automated: true
      },
      {
        id: 'ind_2',
        type: 'Image Duplication',
        description: 'Potential duplicate use of microscopy images across different experimental conditions',
        evidence: 'Figures 3A and 4C show 98.7% pixel similarity',
        weight: 92,
        automated: true
      }
    ],
    status: 'investigating',
    investigator: 'Dr. James Wilson'
  }
];

export const STATUS_COLORS: Record<VerificationStatus, string> = {
  pending: '#ff9800',
  'in-progress': '#2196f3',
  verified: '#4caf50',
  rejected: '#f44336',
  expired: '#9e9e9e',
  'under-review': '#ffc107'
};

export const SEVERITY_COLORS: Record<FindingSeverity, string> = {
  critical: '#d32f2f',
  high: '#f44336',
  medium: '#ff9800',
  low: '#ffc107',
  info: '#2196f3'
};

export const BADGE_COLORS: Record<BadgeLevel, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
  diamond: '#b9f2ff'
};
