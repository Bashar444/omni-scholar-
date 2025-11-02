import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Paper } from '../papers/entities/paper.entity';

export interface SearchResult {
  paper: Paper;
  score: number;
  highlights?: {
    title?: string;
    abstract?: string;
  };
}

export interface SearchFilters {
  author?: string;
  journal?: string;
  startDate?: Date;
  endDate?: Date;
  keywords?: string[];
  openAccess?: boolean;
  preprint?: boolean;
  minCitations?: number;
  maxCitations?: number;
}

@Injectable()
export class SearchService {
  private readonly k1 = 1.5; // BM25 parameter
  private readonly b = 0.75; // BM25 parameter
  private readonly avgDocLength = 500; // Average document length in tokens

  constructor(
    @InjectRepository(Paper)
    private papersRepository: Repository<Paper>,
  ) {}

  /**
   * BM25 Relevance Ranking Algorithm
   * score = IDF(qi) * (f(qi, D) * (k1 + 1)) / (f(qi, D) + k1 * (1 - b + b * |D| / avgdl))
   */
  private calculateBM25Score(
    query: string,
    paper: Paper,
    totalDocs: number,
    docsWithTerm: number,
  ): number {
    const queryTerms = query.toLowerCase().split(/\s+/);
    let score = 0;

    for (const term of queryTerms) {
      // Calculate IDF (Inverse Document Frequency)
      const idf = Math.log((totalDocs - docsWithTerm + 0.5) / (docsWithTerm + 0.5) + 1);

      // Calculate term frequency in document
      const titleFreq = (paper.title.toLowerCase().match(new RegExp(term, 'g')) || []).length * 3; // Title boost
      const abstractFreq = (paper.abstract.toLowerCase().match(new RegExp(term, 'g')) || []).length;
      const keywordFreq = paper.keywords?.filter((k) => k.toLowerCase().includes(term)).length || 0 * 2; // Keyword boost

      const totalFreq = titleFreq + abstractFreq + keywordFreq;

      if (totalFreq > 0) {
        // Document length normalization
        const docLength = paper.title.split(/\s+/).length + paper.abstract.split(/\s+/).length;
        const normalization = 1 - this.b + this.b * (docLength / this.avgDocLength);

        // BM25 formula
        const bm25 = (idf * (totalFreq * (this.k1 + 1))) / (totalFreq + this.k1 * normalization);
        score += bm25;
      }
    }

    return score;
  }

  /**
   * Search papers with BM25 ranking
   */
  async search(query: string, filters?: SearchFilters, skip: number = 0, take: number = 20): Promise<SearchResult[]> {
    let queryBuilder = this.papersRepository.createQueryBuilder('paper');

    // Apply filters
    if (filters?.author) {
      queryBuilder = queryBuilder.andWhere('paper.authors LIKE :author', { author: `%${filters.author}%` });
    }

    if (filters?.journal) {
      queryBuilder = queryBuilder.andWhere('paper.journal ILIKE :journal', { journal: `%${filters.journal}%` });
    }

    if (filters?.startDate && filters?.endDate) {
      queryBuilder = queryBuilder.andWhere('paper.publishedDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    if (filters?.keywords && filters.keywords.length > 0) {
      const keywordConditions = filters.keywords.map((kw, idx) => `paper.keywords LIKE :kw${idx}`).join(' OR ');
      const keywordParams: Record<string, string> = {};
      filters.keywords.forEach((kw, idx) => {
        keywordParams[`kw${idx}`] = `%${kw}%`;
      });
      queryBuilder = queryBuilder.andWhere(`(${keywordConditions})`, keywordParams);
    }

    if (filters?.openAccess !== undefined) {
      queryBuilder = queryBuilder.andWhere('paper.openAccess = :openAccess', { openAccess: filters.openAccess });
    }

    if (filters?.preprint !== undefined) {
      queryBuilder = queryBuilder.andWhere('paper.preprint = :preprint', { preprint: filters.preprint });
    }

    if (filters?.minCitations !== undefined) {
      queryBuilder = queryBuilder.andWhere('paper.citationCount >= :minCitations', { minCitations: filters.minCitations });
    }

    if (filters?.maxCitations !== undefined) {
      queryBuilder = queryBuilder.andWhere('paper.citationCount <= :maxCitations', { maxCitations: filters.maxCitations });
    }

    // Get total count for IDF calculation
    const totalDocs = await queryBuilder.getCount();

    // Get papers matching filters
    const papers = await queryBuilder.skip(skip).take(take * 2).getMany(); // Get more to rank

    // Calculate BM25 scores
    const results: SearchResult[] = papers.map((paper) => {
      const docsWithTerm = papers.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.abstract.toLowerCase().includes(query.toLowerCase()) ||
          p.keywords?.some((k) => k.toLowerCase().includes(query.toLowerCase())),
      ).length;

      const score = this.calculateBM25Score(query, paper, totalDocs, docsWithTerm);

      return {
        paper,
        score,
        highlights: this.generateHighlights(query, paper),
      };
    });

    // Sort by score and return top results
    return results.sort((a, b) => b.score - a.score).slice(0, take);
  }

  /**
   * Autocomplete suggestions
   */
  async autocomplete(prefix: string, limit: number = 10): Promise<string[]> {
    const papers = await this.papersRepository
      .createQueryBuilder('paper')
      .where('paper.title ILIKE :prefix', { prefix: `${prefix}%` })
      .select('paper.title')
      .limit(limit)
      .getMany();

    return papers.map((p) => p.title).filter((title, index, self) => self.indexOf(title) === index);
  }

  /**
   * Get search suggestions (did you mean)
   */
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const suggestions = new Set<string>();

    for (const term of queryTerms) {
      // Find papers with similar terms
      const papers = await this.papersRepository
        .createQueryBuilder('paper')
        .where('paper.title ILIKE :term', { term: `%${term}%` })
        .orWhere('paper.keywords LIKE :term', { term: `%${term}%` })
        .select(['paper.title', 'paper.keywords'])
        .limit(limit)
        .getMany();

      papers.forEach((paper) => {
        if (paper.keywords) {
          paper.keywords.forEach((kw) => {
            if (kw.toLowerCase().includes(term)) {
              suggestions.add(kw);
            }
          });
        }
      });
    }

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get trending searches
   */
  async getTrendingSearches(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    // This would typically come from a search history table
    // For now, return popular keywords from papers
    const papers = await this.papersRepository.find({ take: 100 });
    const keywordCounts = new Map<string, number>();

    papers.forEach((paper) => {
      if (paper.keywords) {
        paper.keywords.forEach((kw) => {
          keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
        });
      }
    });

    return Array.from(keywordCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Generate search highlights
   */
  private generateHighlights(query: string, paper: Paper): { title?: string; abstract?: string } {
    const highlights: { title?: string; abstract?: string } = {};
    const queryTerms = query.toLowerCase().split(/\s+/);

    // Highlight in title
    let highlightedTitle = paper.title;
    queryTerms.forEach((term) => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedTitle = highlightedTitle.replace(regex, '<mark>$1</mark>');
    });
    if (highlightedTitle !== paper.title) {
      highlights.title = highlightedTitle;
    }

    // Highlight in abstract (first 200 chars)
    let highlightedAbstract = paper.abstract.substring(0, 200);
    queryTerms.forEach((term) => {
      const regex = new RegExp(`(${term})`, 'gi');
      highlightedAbstract = highlightedAbstract.replace(regex, '<mark>$1</mark>');
    });
    if (highlightedAbstract !== paper.abstract.substring(0, 200)) {
      highlights.abstract = highlightedAbstract + '...';
    }

    return highlights;
  }

  /**
   * Advanced search with multiple criteria
   */
  async advancedSearch(
    query: string,
    filters: SearchFilters,
    skip: number = 0,
    take: number = 20,
  ): Promise<SearchResult[]> {
    return this.search(query, filters, skip, take);
  }

  /**
   * Search by boolean operators (AND, OR, NOT)
   */
  async booleanSearch(query: string, skip: number = 0, take: number = 20): Promise<SearchResult[]> {
    // Parse boolean query
    const andTerms = query.match(/(?:^|\s)([^\s]+)(?=\s|$)/g) || [];
    const orTerms = query.split(' OR ').map((t) => t.trim());
    const notTerms = query.match(/NOT\s+(\w+)/g)?.map((t) => t.replace('NOT ', '')) || [];

    let queryBuilder = this.papersRepository.createQueryBuilder('paper');

    // AND conditions
    andTerms.forEach((term, idx) => {
      if (!term.includes('OR') && !term.includes('NOT')) {
        queryBuilder = queryBuilder.andWhere(
          `(paper.title ILIKE :and${idx} OR paper.abstract ILIKE :and${idx} OR paper.keywords LIKE :and${idx})`,
          { [`and${idx}`]: `%${term}%` },
        );
      }
    });

    // OR conditions
    if (orTerms.length > 1) {
      const orConditions = orTerms.map((_, idx) => `paper.title ILIKE :or${idx}`).join(' OR ');
      const orParams: Record<string, string> = {};
      orTerms.forEach((term, idx) => {
        orParams[`or${idx}`] = `%${term}%`;
      });
      queryBuilder = queryBuilder.andWhere(`(${orConditions})`, orParams);
    }

    // NOT conditions
    notTerms.forEach((term, idx) => {
      queryBuilder = queryBuilder.andWhere(`paper.title NOT ILIKE :not${idx}`, { [`not${idx}`]: `%${term}%` });
    });

    const papers = await queryBuilder.skip(skip).take(take).getMany();

    return papers.map((paper) => ({
      paper,
      score: 1,
    }));
  }
}
