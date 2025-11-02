import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiteratureReview } from './entities/literature-review.entity';
import { LiteratureReviewAgentService } from './literature-review-agent.service';
import { LiteratureReviewAgentController } from './literature-review-agent.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LiteratureReview])],
  providers: [LiteratureReviewAgentService],
  controllers: [LiteratureReviewAgentController],
  exports: [LiteratureReviewAgentService],
})
export class LiteratureReviewAgentModule {}
