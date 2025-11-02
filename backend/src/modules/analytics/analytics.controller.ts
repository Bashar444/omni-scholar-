import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { UserAction } from './entities/user-action.entity';
import { TrendingPaper } from './entities/trending-paper.entity';
import { UsageStats, ResearchTrend } from './analytics.repository';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('action')
  @HttpCode(HttpStatus.CREATED)
  async recordAction(
    @Body()
    body: {
      actionType: 'search' | 'view' | 'download' | 'save' | 'cite' | 'share' | 'annotate';
      paperId?: string;
      userId?: string;
      query?: string;
      metadata?: Record<string, any>;
    },
  ): Promise<UserAction> {
    return this.analyticsService.recordAction(
      body.actionType,
      body.paperId,
      body.userId,
      body.query,
      body.metadata,
    );
  }

  @Get('user/:userId/actions')
  async getUserActions(
    @Param('userId') userId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<UserAction[]> {
    return this.analyticsService.getUserActions(userId, skip, take);
  }

  @Get('actions/by-type/:type')
  async getActionsByType(
    @Param('type') type: 'search' | 'view' | 'download' | 'save' | 'cite' | 'share' | 'annotate',
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<UserAction[]> {
    return this.analyticsService.getActionsByType(type, skip, take);
  }

  @Get('paper/:paperId/actions')
  async getPaperActions(
    @Param('paperId') paperId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ): Promise<UserAction[]> {
    return this.analyticsService.getPaperActions(paperId, skip, take);
  }

  @Get('search-queries')
  async getSearchQueries(@Query('limit') limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    return this.analyticsService.getSearchQueries(limit);
  }

  @Get('usage-stats')
  async getUsageStats(@Query('days') days: number = 30): Promise<UsageStats> {
    return this.analyticsService.getUsageStats(days);
  }

  @Get('trending/:timeframe')
  async getTrendingPapers(
    @Param('timeframe') timeframe: '1h' | '24h' | '7d' | '30d' | '90d',
    @Query('limit') limit: number = 10,
  ): Promise<TrendingPaper[]> {
    return this.analyticsService.getTrendingPapers(timeframe, limit);
  }

  @Post('trending/:timeframe/update')
  @HttpCode(HttpStatus.OK)
  async updateTrendingPapers(
    @Param('timeframe') timeframe: '1h' | '24h' | '7d' | '30d' | '90d',
  ): Promise<{ message: string }> {
    await this.analyticsService.updateTrendingPapers(timeframe);
    return { message: `Trending papers updated for ${timeframe}` };
  }

  @Get('research-trends')
  async getResearchTrends(@Query('days') days: number = 30): Promise<ResearchTrend[]> {
    return this.analyticsService.getResearchTrends(days);
  }
}
