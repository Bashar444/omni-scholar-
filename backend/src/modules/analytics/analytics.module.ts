import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAction } from './entities/user-action.entity';
import { TrendingPaper } from './entities/trending-paper.entity';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsRepository } from './analytics.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserAction, TrendingPaper])],
  providers: [AnalyticsService, AnalyticsRepository],
  controllers: [AnalyticsController],
  exports: [AnalyticsService, AnalyticsRepository],
})
export class AnalyticsModule {}
