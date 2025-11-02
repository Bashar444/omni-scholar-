import { IsString, IsOptional, IsUUID } from 'class-validator';

export class AnalyzeLiteratureReviewDto {
  @IsString()
  fileName: string;

  @IsString()
  pdfText: string;

  @IsOptional()
  @IsUUID()
  paperId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  customPrompt?: string;
}

export class LiteratureReviewAnalysisResult {
  mainThemes: string[];
  keyCitations: Array<{
    author: string;
    year: number;
    finding: string;
    citationCount?: number;
  }>;
  theoreticalFrameworks: string[];
  identifiedGaps: string[];
  implications: string[];
  keyAuthors: Array<{
    name: string;
    frequency: number;
    papers: number;
  }>;
  summary: string;
  extractedReviewText: string;
}
