import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('authors')
@Index(['name'])
@Index(['orcid'], { unique: true, where: '"orcid" IS NOT NULL' })
@Index(['email'], { unique: true, where: '"email" IS NOT NULL' })
@Index(['institution'])
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  institution: string;

  @Column({ nullable: true, unique: true })
  orcid: string;

  @Column({ nullable: true })
  researchGateId: string;

  @Column({ nullable: true })
  googleScholarId: string;

  @Column({ nullable: true })
  scopusAuthorId: string;

  @Column({ nullable: true })
  pubmedAuthorId: string;

  @Column('int', { nullable: true })
  hIndex: number;

  @Column('int', { nullable: true })
  i10Index: number;

  @Column('int', { default: 0 })
  totalCitations: number;

  @Column('int', { default: 0 })
  totalPublications: number;

  @Column('simple-array', { nullable: true })
  researchInterests: string[];

  @Column('simple-array', { nullable: true })
  expertise: string[];

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  profileUrl: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column('float', { nullable: true })
  reputation: number;

  @Column('int', { default: 0 })
  collaboratorCount: number;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
