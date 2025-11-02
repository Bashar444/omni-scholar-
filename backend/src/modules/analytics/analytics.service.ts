import { Injectable } from '@nestjs/common';
import { AnalyticsRepository, UsageStats, ResearchTrend } from './analytics.repository';
import { UserAction } from './entities/user-action.entity';
import { TrendingPaper } from './entities/trending-paper.entity';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async recordAction(
    actionType: 'search' | 'view' | 'download' | 'save' | 'cite' | 'share' | 'annotate',
    paperId?: string,
    userId?: string,
    query?: string,
    metadata?: Record<string, any>,
  ): Promise<UserAction> {
    const action = new UserAction();
    action.actionType = actionType;
    action.paperId = paperId;
    action.userId = userId;
    action.query = query;
    action.metadata = metadata;

    return this.analyticsRepository.recordAction(action);
  }

  async getUserActions(userId: string, skip: number = 0, take: number = 20): Promise<UserAction[]> {
    return this.analyticsRepository.getUserActions(userId, skip, take);
  }

  async getActionsByType(
    actionType: 'search' | 'view' | 'download' | 'save' | 'cite' | 'share' | 'annotate',
    skip: number = 0,
    take: number = 20,
  ): Promise<UserAction[]> {
    return this.analyticsRepository.getActionsByType(actionType, skip, take);
  }

  async getPaperActions(paperId: string, skip: number = 0, take: number = 20): Promise<UserAction[]> {
    return this.analyticsRepository.getPaperActions(paperId, skip, take);
  }

  async getSearchQueries(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    return this.analyticsRepository.getSearchQueries(limit);
  }

  async getUsageStats(days: number = 30): Promise<UsageStats> {
    return this.analyticsRepository.getUsageStats(days);
  }

  async getTrendingPapers(timeframe: '1h' | '24h' | '7d' | '30d' | '90d', limit: number = 10): Promise<TrendingPaper[]> {
    return this.analyticsRepository.getTrendingPapers(timeframe, limit);
  }

  async updateTrendingPapers(timeframe: '1h' | '24h' | '7d' | '30d' | '90d'): Promise<void> {
    return this.analyticsRepository.updateTrendingPapers(timeframe);
  }

  async getResearchTrends(days: number = 30): Promise<ResearchTrend[]> {
    return this.analyticsRepository.getResearchTrends(days);
  }
}
