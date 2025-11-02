import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('citations')
@Index(['sourcePaperId'])
@Index(['targetPaperId'])
@Index(['sourcePaperId', 'targetPaperId'], { unique: true })
export class Citation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  sourcePaperId: string;

  @Column('uuid')
  targetPaperId: string;

  @Column('text', { nullable: true })
  context: string;

  @Column('varchar', { default: 'direct' })
  citationType: 'direct' | 'indirect' | 'related';

  @Column('int', { default: 1 })
  count: number;

  @Column('float', { nullable: true })
  confidence: number;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
