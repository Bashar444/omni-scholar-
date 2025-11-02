import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { UserAction } from './entities/user-action.entity';
import { TrendingPaper } from './entities/trending-paper.entity';

export interface UsageStats {
  totalSearches: number;
  totalViews: number;
  totalDownloads: number;
  totalSaves: number;
  uniqueUsers: number;
  averageSessionDuration: number;
}

export interface ResearchTrend {
  topic: string;
  count: number;
  growth: number;
  trend: 'rising' | 'stable' | 'declining';
}

@Injectable()
export class AnalyticsRepository {
  constructor(
    @InjectRepository(UserAction)
    private userActionRepository: Repository<UserAction>,
    @InjectRepository(TrendingPaper)
    private trendingPaperRepository: Repository<TrendingPaper>,
  ) {}

  // UserAction methods
  async recordAction(action: UserAction): Promise<UserAction> {
    return this.userActionRepository.save(action);
  }

  async getUserActions(userId: string, skip: number = 0, take: number = 20): Promise<UserAction[]> {
    return this.userActionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async getActionsByType(
    actionType: 'search' | 'view' | 'download' | 'save' | 'cite' | 'share' | 'annotate',
    skip: number = 0,
    take: number = 20,
  ): Promise<UserAction[]> {
    return this.userActionRepository.find({
      where: { actionType },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async getPaperActions(paperId: string, skip: number = 0, take: number = 20): Promise<UserAction[]> {
    return this.userActionRepository.find({
      where: { paperId },
      order: { createdAt: 'DESC' },
      skip,
      take,
    });
  }

  async getSearchQueries(limit: number = 10): Promise<Array<{ query: string; count: number }>> {
    const result = await this.userActionRepository
      .createQueryBuilder('action')
      .select('action.query', 'query')
      .addSelect('COUNT(*)', 'count')
      .where('action.actionType = :actionType', { actionType: 'search' })
      .groupBy('action.query')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((r) => ({ query: r.query, count: parseInt(r.count) }));
  }

  async getUsageStats(days: number = 30): Promise<UsageStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const actions = await this.userActionRepository.find({
      where: { createdAt: Between(startDate, new Date()) },
    });

    const searches = actions.filter((a) => a.actionType === 'search').length;
    const views = actions.filter((a) => a.actionType === 'view').length;
    const downloads = actions.filter((a) => a.actionType === 'download').length;
    const saves = actions.filter((a) => a.actionType === 'save').length;
    const uniqueUsers = new Set(actions.map((a) => a.userId)).size;

    return {
      totalSearches: searches,
      totalViews: views,
      totalDownloads: downloads,
      totalSaves: saves,
      uniqueUsers,
      averageSessionDuration: 0, // Would need session tracking
    };
  }

  // TrendingPaper methods
  async getTrendingPapers(timeframe: '1h' | '24h' | '7d' | '30d' | '90d', limit: number = 10): Promise<TrendingPaper[]> {
    return this.trendingPaperRepository.find({
      where: { timeframe },
      order: { score: 'DESC' },
      take: limit,
    });
  }

  async updateTrendingPapers(timeframe: '1h' | '24h' | '7d' | '30d' | '90d'): Promise<void> {
    // Calculate trending papers based on recent activity
    const startDate = this.getTimeframeStartDate(timeframe);

    const actions = await this.userActionRepository.find({
      where: { createdAt: Between(startDate, new Date()) },
    });

    // Group by paper and calculate score
    const paperScores = new Map<string, number>();

    actions.forEach((action) => {
      if (action.paperId) {
        const weight = this.getActionWeight(action.actionType);
        paperScores.set(action.paperId, (paperScores.get(action.paperId) || 0) + weight);
      }
    });

    // Update trending papers
    for (const [paperId, score] of paperScores) {
      const existing = await this.trendingPaperRepository.findOne({
        where: { paperId, timeframe },
      });

      if (existing) {
        existing.score = score;
        await this.trendingPaperRepository.save(existing);
      } else {
        const trending = this.trendingPaperRepository.create({
          paperId,
          score,
          timeframe,
        });
        await this.trendingPaperRepository.save(trending);
      }
    }
  }

  async getResearchTrends(days: number = 30): Promise<ResearchTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const actions = await this.userActionRepository.find({
      where: { createdAt: Between(startDate, new Date()) },
    });

    const topicCounts = new Map<string, number>();

    actions.forEach((action) => {
      if (action.query) {
        const terms = action.query.split(/\s+/);
        terms.forEach((term) => {
          if (term.length > 3) {
            topicCounts.set(term, (topicCounts.get(term) || 0) + 1);
          }
        });
      }
    });

    return Array.from(topicCounts.entries())
      .map(([topic, count]) => ({
        topic,
        count,
        growth: 0, // Would need historical data
        trend: 'stable' as const,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  private getTimeframeStartDate(timeframe: string): Date {
    const now = new Date();
    switch (timeframe) {
      case '1h':
        now.setHours(now.getHours() - 1);
        break;
      case '24h':
        now.setDate(now.getDate() - 1);
        break;
      case '7d':
        now.setDate(now.getDate() - 7);
        break;
      case '30d':
        now.setDate(now.getDate() - 30);
        break;
      case '90d':
        now.setDate(now.getDate() - 90);
        break;
    }
    return now;
  }

  private getActionWeight(actionType: string): number {
    switch (actionType) {
      case 'download':
        return 5;
      case 'cite':
        return 4;
      case 'save':
        return 3;
      case 'view':
        return 2;
      case 'search':
        return 1;
      default:
        return 1;
    }
  }
}
