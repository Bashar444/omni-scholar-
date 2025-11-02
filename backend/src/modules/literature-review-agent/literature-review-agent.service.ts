import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiteratureReview } from './entities/literature-review.entity';
import { AnalyzeLiteratureReviewDto, LiteratureReviewAnalysisResult } from './dto/analyze-literature-review.dto';

@Injectable()
export class LiteratureReviewAgentService {
  private readonly citationPattern = /\(([A-Za-z\s&]+),\s*(\d{4})\)/g;
  private readonly authorPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:et\s+al\.|and\s+[A-Z][a-z]+)/g;

  constructor(
    @InjectRepository(LiteratureReview)
    private literatureReviewRepository: Repository<LiteratureReview>,
  ) {}

  /**
   * Detect literature review section in academic paper
   */
  private detectLiteratureReviewSection(text: string): string {
    const sections = [
      /(?:^|\n)(?:2\.|##)\s*(?:Literature\s+Review|Related\s+Work|Background|State\s+of\s+the\s+Art)([\s\S]*?)(?=\n(?:3\.|##)|References|Conclusion|$)/i,
      /(?:^|\n)(?:Literature\s+Review|Related\s+Work|Background|State\s+of\s+the\s+Art)([\s\S]*?)(?=\n(?:References|Conclusion|Methodology|Results)|$)/i,
    ];

    for (const pattern of sections) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    // Fallback: return first 40% of text if no section found
    return text.substring(0, Math.floor(text.length * 0.4));
  }

  /**
   * Extract citations from text
   */
  private extractCitations(text: string): Array<{ author: string; year: number; finding: string }> {
    const citations: Array<{ author: string; year: number; finding: string }> = [];
    const matches = [...text.matchAll(this.citationPattern)];

    matches.forEach((match) => {
      const author = match[1].trim();
      const year = parseInt(match[2], 10);

      // Extract surrounding context (finding)
      const startIdx = Math.max(0, match.index - 100);
      const endIdx = Math.min(text.length, match.index + match[0].length + 100);
      const context = text.substring(startIdx, endIdx).trim();

      citations.push({
        author,
        year,
        finding: context,
      });
    });

    return citations;
  }

  /**
   * Extract key authors and their frequency
   */
  private extractKeyAuthors(text: string): Array<{ name: string; frequency: number; papers: number }> {
    const authorFrequency = new Map<string, number>();
    const matches = [...text.matchAll(this.authorPattern)];

    matches.forEach((match) => {
      const author = match[1].trim();
      authorFrequency.set(author, (authorFrequency.get(author) || 0) + 1);
    });

    // Also extract from citation pattern
    const citationMatches = [...text.matchAll(this.citationPattern)];
    citationMatches.forEach((match) => {
      const author = match[1].trim();
      authorFrequency.set(author, (authorFrequency.get(author) || 0) + 1);
    });

    return Array.from(authorFrequency.entries())
      .map(([name, frequency]) => ({
        name,
        frequency,
        papers: Math.ceil(frequency / 2), // Estimate papers
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20);
  }

  /**
   * Extract main themes from text using keyword analysis
   */
  private extractMainThemes(text: string): string[] {
    const themes = new Set<string>();

    // Common academic theme patterns
    const themePatterns = [
      /(?:theory|framework|model|approach|methodology|method)\s+(?:of|for)\s+([A-Za-z\s]+?)(?:\.|,|;)/gi,
      /(?:based on|using|employing|applying)\s+([A-Za-z\s]+?)(?:\s+(?:theory|framework|approach))?(?:\.|,|;)/gi,
      /(?:the\s+)?([A-Za-z\s]+?)\s+(?:theory|framework|model|approach)(?:\s+(?:suggests|proposes|demonstrates))?/gi,
    ];

    themePatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match) => {
        const theme = match[1]?.trim();
        if (theme && theme.length > 3 && theme.length < 100) {
          themes.add(theme);
        }
      });
    });

    return Array.from(themes).slice(0, 15);
  }

  /**
   * Identify research gaps from text
   */
  private identifyGaps(text: string): string[] {
    const gaps: string[] = [];

    const gapPatterns = [
      /(?:gap|lack|absence|limited|few|little)\s+(?:research|studies|evidence|understanding)\s+(?:on|in|about)\s+([A-Za-z\s]+?)(?:\.|,|;)/gi,
      /(?:future\s+)?research\s+(?:should|needs to|must)\s+(?:explore|investigate|examine)\s+([A-Za-z\s]+?)(?:\.|,|;)/gi,
      /(?:unclear|unknown|unexplored|understudied)\s+([A-Za-z\s]+?)(?:\.|,|;)/gi,
    ];

    gapPatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match) => {
        const gap = match[1]?.trim();
        if (gap && gap.length > 5 && gap.length < 150) {
          gaps.push(gap);
        }
      });
    });

    return gaps.slice(0, 10);
  }

  /**
   * Extract implications from text
   */
  private extractImplications(text: string): string[] {
    const implications: string[] = [];

    const implicationPatterns = [
      /(?:implication|imply|suggest|indicate|demonstrate)\s+(?:that\s+)?([A-Za-z\s,]+?)(?:\.|;|,\s+which)/gi,
      /(?:this\s+)?(?:suggests|indicates|demonstrates|implies)\s+([A-Za-z\s,]+?)(?:\.|;)/gi,
      /(?:therefore|thus|consequently|as a result)\s+([A-Za-z\s,]+?)(?:\.|;)/gi,
    ];

    implicationPatterns.forEach((pattern) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach((match) => {
        const implication = match[1]?.trim();
        if (implication && implication.length > 5 && implication.length < 200) {
          implications.push(implication);
        }
      });
    });

    return implications.slice(0, 10);
  }

  /**
   * Generate summary of literature review
   */
  private generateSummary(analysis: Partial<LiteratureReviewAnalysisResult>): string {
    const parts: string[] = [];

    if (analysis.mainThemes?.length > 0) {
      parts.push(`Main themes: ${analysis.mainThemes.slice(0, 3).join(', ')}.`);
    }

    if (analysis.keyCitations?.length > 0) {
      const topCitations = analysis.keyCitations.slice(0, 2);
      parts.push(
        `Key studies: ${topCitations.map((c) => `${c.author} (${c.year})`).join(', ')}.`,
      );
    }

    if (analysis.theoreticalFrameworks?.length > 0) {
      parts.push(`Theoretical frameworks: ${analysis.theoreticalFrameworks.slice(0, 2).join(', ')}.`);
    }

    if (analysis.identifiedGaps?.length > 0) {
      parts.push(`Research gaps: ${analysis.identifiedGaps[0]}.`);
    }

    return parts.join(' ');
  }

  /**
   * Analyze literature review from PDF text
   */
  async analyzeLiteratureReview(
    dto: AnalyzeLiteratureReviewDto,
  ): Promise<LiteratureReviewAnalysisResult> {
    if (!dto.pdfText || dto.pdfText.trim().length === 0) {
      throw new BadRequestException('PDF text cannot be empty');
    }

    // Detect literature review section
    const extractedReviewText = this.detectLiteratureReviewSection(dto.pdfText);

    if (extractedReviewText.length < 100) {
      throw new BadRequestException('Could not find sufficient literature review content');
    }

    // Extract components
    const keyCitations = this.extractCitations(extractedReviewText);
    const keyAuthors = this.extractKeyAuthors(extractedReviewText);
    const mainThemes = this.extractMainThemes(extractedReviewText);
    const theoreticalFrameworks = this.extractMainThemes(extractedReviewText).slice(0, 5);
    const identifiedGaps = this.identifyGaps(extractedReviewText);
    const implications = this.extractImplications(extractedReviewText);

    const analysis: LiteratureReviewAnalysisResult = {
      mainThemes,
      keyCitations,
      theoreticalFrameworks,
      identifiedGaps,
      implications,
      keyAuthors,
      extractedReviewText,
      summary: '',
    };

    // Generate summary
    analysis.summary = this.generateSummary(analysis);

    // Save to database
    const review = this.literatureReviewRepository.create({
      fileName: dto.fileName,
      originalText: dto.pdfText,
      extractedReviewText,
      mainThemes,
      keyCitations,
      theoreticalFrameworks,
      identifiedGaps,
      implications,
      keyAuthors,
      summary: analysis.summary,
      citationCount: keyCitations.length,
      relevanceScore: this.calculateRelevanceScore(analysis),
      paperId: dto.paperId,
      userId: dto.userId,
      metadata: {
        extractedSections: 1,
        analysisDate: new Date(),
      },
    });

    await this.literatureReviewRepository.save(review);

    return analysis;
  }

  /**
   * Calculate relevance score
   */
  private calculateRelevanceScore(analysis: LiteratureReviewAnalysisResult): number {
    let score = 0;

    // Score based on components
    if (analysis.mainThemes?.length > 0) score += 20;
    if (analysis.keyCitations?.length > 5) score += 20;
    if (analysis.theoreticalFrameworks?.length > 0) score += 20;
    if (analysis.identifiedGaps?.length > 0) score += 20;
    if (analysis.implications?.length > 0) score += 20;

    return Math.min(score, 100);
  }

  /**
   * Get all literature reviews for user
   */
  async getUserReviews(userId: string, skip: number = 0, take: number = 20): Promise<LiteratureReview[]> {
    return this.literatureReviewRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  /**
   * Get literature review by ID
   */
  async getReviewById(id: string): Promise<LiteratureReview> {
    return this.literatureReviewRepository.findOne({ where: { id } });
  }

  /**
   * Compare multiple literature reviews
   */
  async compareReviews(reviewIds: string[]): Promise<{
    commonThemes: string[];
    commonAuthors: string[];
    uniqueThemes: Map<string, string[]>;
    citationOverlap: number;
  }> {
    const reviews = await this.literatureReviewRepository.find({
      where: { id: reviewIds as any },
    });

    if (reviews.length === 0) {
      throw new BadRequestException('No reviews found');
    }

    // Find common themes
    const themeSets = reviews.map((r) => new Set(r.mainThemes));
    const commonThemes = Array.from(
      themeSets.reduce((acc, set) => new Set([...acc].filter((x) => set.has(x))), themeSets[0]),
    );

    // Find common authors
    const authorSets = reviews.map((r) => new Set(r.keyAuthors.map((a) => a.name)));
    const commonAuthors = Array.from(
      authorSets.reduce((acc, set) => new Set([...acc].filter((x) => set.has(x))), authorSets[0]),
    );

    // Find unique themes per review
    const uniqueThemes = new Map<string, string[]>();
    reviews.forEach((review, idx) => {
      const unique = review.mainThemes.filter((t) => !commonThemes.includes(t));
      uniqueThemes.set(review.id, unique);
    });

    // Calculate citation overlap
    const citationSets = reviews.map((r) => new Set(r.keyCitations.map((c) => `${c.author}-${c.year}`)));
    const overlapArray = Array.from(citationSets[0] || []).filter((x: string) =>
      citationSets.every((set) => set.has(x)),
    );
    const maxSetSize = Math.max(...citationSets.map((s) => s.size), 1);
    const citationOverlap = overlapArray.length / maxSetSize;

    return {
      commonThemes,
      commonAuthors,
      uniqueThemes,
      citationOverlap,
    };
  }

  /**
   * Export review as JSON
   */
  async exportReviewAsJson(id: string): Promise<string> {
    const review = await this.getReviewById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    return JSON.stringify(
      {
        fileName: review.fileName,
        mainThemes: review.mainThemes,
        keyCitations: review.keyCitations,
        theoreticalFrameworks: review.theoreticalFrameworks,
        identifiedGaps: review.identifiedGaps,
        implications: review.implications,
        keyAuthors: review.keyAuthors,
        summary: review.summary,
        createdAt: review.createdAt,
      },
      null,
      2,
    );
  }

  /**
   * Export review as CSV
   */
  async exportReviewAsCsv(id: string): Promise<string> {
    const review = await this.getReviewById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    const rows: string[] = [];

    // Header
    rows.push('Category,Value');

    // Main themes
    rows.push('Main Themes,' + review.mainThemes.join('; '));

    // Key citations
    review.keyCitations.forEach((citation) => {
      rows.push(`Citation,"${citation.author} (${citation.year}): ${citation.finding}"`);
    });

    // Theoretical frameworks
    rows.push('Theoretical Frameworks,' + review.theoreticalFrameworks.join('; '));

    // Identified gaps
    review.identifiedGaps.forEach((gap) => {
      rows.push(`Gap,"${gap}"`);
    });

    // Implications
    review.implications.forEach((implication) => {
      rows.push(`Implication,"${implication}"`);
    });

    return rows.join('\n');
  }
}
