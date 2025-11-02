import { IsString, IsNumber, IsOptional, Min, Max, IsUUID } from 'class-validator';

export class CreateCitationDto {
  @IsUUID()
  sourcePaperId: string;

  @IsUUID()
  targetPaperId: string;

  @IsOptional()
  @IsString()
  context?: string;

  @IsOptional()
  @IsString()
  citationType?: 'direct' | 'indirect' | 'related';

  @IsOptional()
  @IsNumber()
  @Min(1)
  count?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence?: number;

  @IsOptional()
  metadata?: Record<string, any>;
}
