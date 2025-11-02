import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { LiteratureReviewAgentService } from './literature-review-agent.service';
import { AnalyzeLiteratureReviewDto, LiteratureReviewAnalysisResult } from './dto/analyze-literature-review.dto';
import { LiteratureReview } from './entities/literature-review.entity';

@Controller('literature-review-agent')
export class LiteratureReviewAgentController {
  constructor(private readonly literatureReviewAgentService: LiteratureReviewAgentService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.CREATED)
  async analyzeLiteratureReview(
    @Body() dto: AnalyzeLiteratureReviewDto,
  ): Promise<LiteratureReviewAnalysisResult> {
    return this.literatureReviewAgentService.analyzeLiteratureReview(dto);
  }

  @Get('user/:userId')
  async getUserReviews(
    @Param('userId') userId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<LiteratureReview[]> {
    return this.literatureReviewAgentService.getUserReviews(userId, skip, take);
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<LiteratureReview> {
    const review = await this.literatureReviewAgentService.getReviewById(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }
    return review;
  }

  @Post('compare')
  @HttpCode(HttpStatus.OK)
  async compareReviews(
    @Body() body: { reviewIds: string[] },
  ): Promise<{
    commonThemes: string[];
    commonAuthors: string[];
    uniqueThemes: Map<string, string[]>;
    citationOverlap: number;
  }> {
    if (!body.reviewIds || body.reviewIds.length < 2) {
      throw new BadRequestException('At least 2 review IDs required for comparison');
    }
    return this.literatureReviewAgentService.compareReviews(body.reviewIds);
  }

  @Get(':id/export/json')
  async exportAsJson(@Param('id') id: string): Promise<{ data: string }> {
    const json = await this.literatureReviewAgentService.exportReviewAsJson(id);
    return { data: json };
  }

  @Get(':id/export/csv')
  async exportAsCsv(@Param('id') id: string): Promise<{ data: string }> {
    const csv = await this.literatureReviewAgentService.exportReviewAsCsv(id);
    return { data: csv };
  }
}
