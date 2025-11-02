import { IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsUrl, IsISO8601, Min, Max } from 'class-validator';

export class CreatePaperDto {
  @IsString()
  title: string;

  @IsString()
  abstract: string;

  @IsNumber()
  @Min(1900)
  @Max(2100)
  year: number;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsISO8601()
  publishedDate?: Date;

  @IsOptional()
  @IsString()
  journal?: string;

  @IsOptional()
  @IsString()
  volume?: string;

  @IsOptional()
  @IsString()
  issue?: string;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsBoolean()
  openAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  preprint?: boolean;

  @IsOptional()
  @IsUrl()
  fullTextUrl?: string;

  @IsOptional()
  @IsString()
  arxivId?: string;

  @IsOptional()
  @IsString()
  pubmedId?: string;

  @IsOptional()
  @IsString()
  scopusId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  citationCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  impactFactor?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}
