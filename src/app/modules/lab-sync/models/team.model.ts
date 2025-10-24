export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  memberCount: number;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  avatar?: string;
  isOnline: boolean;
  lastActive: Date;
}

export interface SharedPaper {
  id: string;
  title: string;
  authors: string;
  year: number;
  addedBy: string;
  addedAt: Date;
  commentsCount: number;
  tags: string[];
  status: 'reading' | 'read' | 'to-review' | 'archived';
}

export interface Comment {
  id: string;
  paperId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  replyToId?: string;
  reactions: Reaction[];
}

export interface Reaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  relatedPaperId?: string;
  tags: string[];
}

export interface Activity {
  id: string;
  type: 'paper_added' | 'comment_added' | 'task_created' | 'task_completed' | 'member_joined' | 'paper_status_changed';
  userId: string;
  userName: string;
  description: string;
  timestamp: Date;
  relatedId?: string;
  icon: string;
  color: string;
}

export interface TeamAnalytics {
  totalPapers: number;
  papersReadThisWeek: number;
  totalComments: number;
  totalTasks: number;
  tasksCompleted: number;
  activeMembers: number;
  mostActiveMember: string;
  papersByStatus: {
    reading: number;
    read: number;
    toReview: number;
    archived: number;
  };
  tasksByStatus: {
    todo: number;
    inProgress: number;
    review: number;
    done: number;
  };
}

export const MEMBER_ROLES: Array<{ value: TeamMember['role']; label: string; description: string }> = [
  { value: 'owner', label: 'Owner', description: 'Full control over team and settings' },
  { value: 'admin', label: 'Admin', description: 'Can manage members and content' },
  { value: 'member', label: 'Member', description: 'Can add papers and participate' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
];

export const PAPER_STATUSES: Array<{ value: SharedPaper['status']; label: string; icon: string; color: string }> = [
  { value: 'reading', label: 'Reading', icon: 'auto_stories', color: '#2196F3' },
  { value: 'read', label: 'Read', icon: 'check_circle', color: '#4CAF50' },
  { value: 'to-review', label: 'To Review', icon: 'rate_review', color: '#FF9800' },
  { value: 'archived', label: 'Archived', icon: 'archive', color: '#9E9E9E' }
];

export const TASK_PRIORITIES: Array<{ value: Task['priority']; label: string; color: string }> = [
  { value: 'low', label: 'Low', color: '#4CAF50' },
  { value: 'medium', label: 'Medium', color: '#2196F3' },
  { value: 'high', label: 'High', color: '#FF9800' },
  { value: 'urgent', label: 'Urgent', color: '#F44336' }
];
