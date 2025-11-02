import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('user_actions')
@Index(['userId'])
@Index(['paperId'])
@Index(['actionType'])
@Index(['createdAt'])
export class UserAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { nullable: true })
  userId: string;

  @Column('varchar')
  actionType: 'search' | 'view' | 'download' | 'save' | 'cite' | 'share' | 'annotate';

  @Column('uuid', { nullable: true })
  paperId: string;

  @Column('text', { nullable: true })
  query: string;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
