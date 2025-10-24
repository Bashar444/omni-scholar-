export type Source = 'arXiv' | 'PubMed' | 'CrossRef';

export const AVAILABLE_SOURCES: Source[] = ['arXiv', 'PubMed', 'CrossRef'];

export interface PaperResult {
  id: string;
  title: string;
  authors: string[];
  year: number;
  source: Source;
}

export interface ScholarGraphState {
  query: string;
  results: PaperResult[];
  loading: boolean;
  error?: string | null;
  selectedSources: Source[];
}

export const initialScholarGraphState: ScholarGraphState = {
  query: '',
  results: [],
  loading: false,
  error: null,
  selectedSources: []
};
