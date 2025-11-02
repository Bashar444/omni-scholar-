import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('literature_reviews')
@Index(['userId'])
@Index(['paperId'])
@Index(['createdAt'])
export class LiteratureReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('uuid', { nullable: true })
  paperId: string;

  @Column()
  fileName: string;

  @Column('text')
  originalText: string;

  @Column('text')
  extractedReviewText: string;

  @Column('simple-json')
  mainThemes: string[];

  @Column('simple-json')
  keyCitations: Array<{
    author: string;
    year: number;
    finding: string;
    citationCount?: number;
  }>;

  @Column('simple-json')
  theoreticalFrameworks: string[];

  @Column('simple-json')
  identifiedGaps: string[];

  @Column('simple-json')
  implications: string[];

  @Column('simple-json')
  keyAuthors: Array<{
    name: string;
    frequency: number;
    papers: number;
  }>;

  @Column('text', { nullable: true })
  summary: string;

  @Column('int')
  citationCount: number;

  @Column('float')
  relevanceScore: number;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
