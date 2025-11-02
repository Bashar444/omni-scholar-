import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('papers')
@Index(['doi'], { unique: true, where: '"doi" IS NOT NULL' })
@Index(['publishedDate'])
@Index(['journal'])
@Index(['keywords'])
export class Paper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  abstract: string;

  @Column()
  year: number;

  @Column('simple-array')
  authors: string[];

  @Column({ nullable: true, unique: true })
  doi: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  publishedDate: Date;

  @Column({ nullable: true })
  journal: string;

  @Column({ nullable: true })
  volume: string;

  @Column({ nullable: true })
  issue: string;

  @Column({ nullable: true })
  pages: string;

  @Column('simple-array', { nullable: true })
  keywords: string[];

  @Column({ default: false })
  openAccess: boolean;

  @Column({ default: false })
  preprint: boolean;

  @Column({ nullable: true })
  fullTextUrl: string;

  @Column({ nullable: true })
  arxivId: string;

  @Column({ nullable: true })
  pubmedId: string;

  @Column({ nullable: true })
  scopusId: string;

  @Column({ default: 0 })
  citationCount: number;

  @Column({ nullable: true })
  impactFactor: number;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
