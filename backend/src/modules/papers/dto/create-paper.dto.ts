import { IsString, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';

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
  @IsNumber()
  @Min(0)
  citationCount?: number;
}
