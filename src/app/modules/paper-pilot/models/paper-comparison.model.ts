export interface UploadedPaper {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: Date;
  extractedData?: ExtractedMetadata;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface ExtractedMetadata {
  title?: string;
  authors?: string[];
  year?: number;
  abstract?: string;
  methodology?: string;
  results?: string;
  conclusions?: string;
  keyFindings?: string[];
  citations?: CitationReference[];
  citationCount?: number;
  keywords?: string[];
  fullText?: string;
}

export interface CitationReference {
  title: string;
  authors?: string[];
  year?: number;
  journal?: string;
  doi?: string;
}

export interface ComparisonView {
  id: string;
  userId: string;
  name: string;
  paperIds: string[];
  papers: UploadedPaper[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  year: number;
  papers: UploadedPaper[];
  milestones?: string[];
}

export interface ComparisonField {
  label: string;
  key: keyof ExtractedMetadata;
  type: 'text' | 'list' | 'number';
  exportable: boolean;
}

export const COMPARISON_FIELDS: ComparisonField[] = [
  { label: 'Title', key: 'title', type: 'text', exportable: true },
  { label: 'Authors', key: 'authors', type: 'list', exportable: true },
  { label: 'Year', key: 'year', type: 'number', exportable: true },
  { label: 'Abstract', key: 'abstract', type: 'text', exportable: true },
  { label: 'Methodology', key: 'methodology', type: 'text', exportable: true },
  { label: 'Results', key: 'results', type: 'text', exportable: true },
  { label: 'Conclusions', key: 'conclusions', type: 'text', exportable: true },
  { label: 'Key Findings', key: 'keyFindings', type: 'list', exportable: true },
  { label: 'Citation Count', key: 'citationCount', type: 'number', exportable: true },
  { label: 'Keywords', key: 'keywords', type: 'list', exportable: true }
];

export type ExportFormat = 'csv' | 'excel' | 'markdown' | 'json';
