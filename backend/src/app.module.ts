import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { PapersModule } from './modules/papers/papers.module';
import { SearchModule } from './modules/search/search.module';
import { CitationsModule } from './modules/citations/citations.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { LiteratureReviewAgentModule } from './modules/literature-review-agent/literature-review-agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Paper } from './modules/papers/entities/paper.entity';
import { Citation } from './modules/citations/entities/citation.entity';
import { Author } from './modules/authors/entities/author.entity';
import { UserAction } from './modules/analytics/entities/user-action.entity';
import { TrendingPaper } from './modules/analytics/entities/trending-paper.entity';
import { LiteratureReview } from './modules/literature-review-agent/entities/literature-review.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'scholar'),
        password: configService.get('DB_PASSWORD', 'scholar_pass'),
        database: configService.get('DB_NAME', 'omni_scholar'),
        entities: [Paper, Citation, Author, UserAction, TrendingPaper, LiteratureReview],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    PapersModule,
    SearchModule,
    CitationsModule,
    AuthorsModule,
    AnalyticsModule,
    LiteratureReviewAgentModule,
    UsersModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
