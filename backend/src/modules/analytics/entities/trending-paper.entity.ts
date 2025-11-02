import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('trending_papers')
@Index(['paperId'])
@Index(['timeframe'])
@Index(['score'])
@Index(['updatedAt'])
export class TrendingPaper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  paperId: string;

  @Column('float')
  score: number;

  @Column('varchar')
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d';

  @Column('int', { default: 0 })
  viewCount: number;

  @Column('int', { default: 0 })
  downloadCount: number;

  @Column('int', { default: 0 })
  citationGrowth: number;

  @Column('int', { default: 0 })
  searchCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
