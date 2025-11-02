import { IsString, IsEmail, IsOptional, IsArray, IsNumber, IsUrl, Min, Max } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  orcid?: string;

  @IsOptional()
  @IsString()
  researchGateId?: string;

  @IsOptional()
  @IsString()
  googleScholarId?: string;

  @IsOptional()
  @IsString()
  scopusAuthorId?: string;

  @IsOptional()
  @IsString()
  pubmedAuthorId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hIndex?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  i10Index?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalCitations?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPublications?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  researchInterests?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl()
  profileUrl?: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  reputation?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  collaboratorCount?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}
