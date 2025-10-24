import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Team, TeamMember, SharedPaper, Comment, Task, Activity, TeamAnalytics, Reaction } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly STORAGE_KEY = 'lab_sync_teams';
  private readonly CURRENT_USER_KEY = 'lab_sync_current_user';
  private currentTeamId: string | null = null;

  constructor() {
    this.initializeDemoData();
  }

  // ===== Team Management =====

  getCurrentUser(): TeamMember {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      return {
        ...user,
        joinedAt: new Date(user.joinedAt),
        lastActive: new Date(user.lastActive)
      };
    }

    // Create default user
    const user: TeamMember = {
      id: 'user-1',
      name: 'You',
      email: 'you@university.edu',
      role: 'owner',
      joinedAt: new Date(),
      lastActive: new Date(),
      isOnline: true
    };
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  getAllTeams(): Team[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    const teams = JSON.parse(data);
    return teams.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt)
    }));
  }

  getCurrentTeam(): Team | null {
    if (!this.currentTeamId) {
      const teams = this.getAllTeams();
      if (teams.length > 0) {
        this.currentTeamId = teams[0].id;
      }
    }

    const teams = this.getAllTeams();
    return teams.find(t => t.id === this.currentTeamId) || null;
  }

  createTeam(name: string, description: string): Observable<Team> {
    const user = this.getCurrentUser();
    const team: Team = {
      id: this.generateId(),
      name,
      description,
      createdAt: new Date(),
      createdBy: user.id,
      memberCount: 1
    };

    const teams = this.getAllTeams();
    teams.push(team);
    this.saveTeams(teams);
    this.currentTeamId = team.id;

    return of(team).pipe(delay(500));
  }

  switchTeam(teamId: string): void {
    this.currentTeamId = teamId;
  }

  // ===== Members =====

  getTeamMembers(teamId?: string): TeamMember[] {
    const id = teamId || this.currentTeamId;
    if (!id) return [];

    const key = `team_${id}_members`;
    const data = localStorage.getItem(key);
    if (!data) return [this.getCurrentUser()];

    const members = JSON.parse(data);
    return members.map((m: any) => ({
      ...m,
      joinedAt: new Date(m.joinedAt),
      lastActive: new Date(m.lastActive)
    }));
  }

  addMember(name: string, email: string, role: TeamMember['role']): Observable<TeamMember> {
    const member: TeamMember = {
      id: this.generateId(),
      name,
      email,
      role,
      joinedAt: new Date(),
      lastActive: new Date(),
      isOnline: Math.random() > 0.3
    };

    const members = this.getTeamMembers();
    members.push(member);
    this.saveMembers(members);

    // Update team member count
    this.updateTeamMemberCount();

    // Add activity
    this.addActivity({
      type: 'member_joined',
      userId: member.id,
      userName: member.name,
      description: `${member.name} joined the team`,
      icon: 'person_add',
      color: '#4CAF50'
    });

    return of(member).pipe(delay(500));
  }

  removeMember(memberId: string): void {
    let members = this.getTeamMembers();
    members = members.filter(m => m.id !== memberId);
    this.saveMembers(members);
    this.updateTeamMemberCount();
  }

  // ===== Papers =====

  getSharedPapers(): SharedPaper[] {
    const key = `team_${this.currentTeamId}_papers`;
    const data = localStorage.getItem(key);
    if (!data) return [];

    const papers = JSON.parse(data);
    return papers.map((p: any) => ({
      ...p,
      addedAt: new Date(p.addedAt)
    }));
  }

  addSharedPaper(title: string, authors: string, year: number, tags: string[] = []): Observable<SharedPaper> {
    const user = this.getCurrentUser();
    const paper: SharedPaper = {
      id: this.generateId(),
      title,
      authors,
      year,
      addedBy: user.name,
      addedAt: new Date(),
      commentsCount: 0,
      tags,
      status: 'reading'
    };

    const papers = this.getSharedPapers();
    papers.push(paper);
    this.savePapers(papers);

    // Add activity
    this.addActivity({
      type: 'paper_added',
      userId: user.id,
      userName: user.name,
      description: `added "${title}"`,
      icon: 'note_add',
      color: '#2196F3',
      relatedId: paper.id
    });

    return of(paper).pipe(delay(500));
  }

  updatePaperStatus(paperId: string, status: SharedPaper['status']): void {
    const papers = this.getSharedPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
      paper.status = status;
      this.savePapers(papers);

      // Add activity
      const user = this.getCurrentUser();
      this.addActivity({
        type: 'paper_status_changed',
        userId: user.id,
        userName: user.name,
        description: `marked "${paper.title}" as ${status}`,
        icon: 'sync',
        color: '#FF9800',
        relatedId: paperId
      });
    }
  }

  deletePaper(paperId: string): void {
    let papers = this.getSharedPapers();
    papers = papers.filter(p => p.id !== paperId);
    this.savePapers(papers);

    // Also delete comments for this paper
    const key = `team_${this.currentTeamId}_comments_${paperId}`;
    localStorage.removeItem(key);
  }

  // ===== Comments =====

  getComments(paperId: string): Comment[] {
    const key = `team_${this.currentTeamId}_comments_${paperId}`;
    const data = localStorage.getItem(key);
    if (!data) return [];

    const comments = JSON.parse(data);
    return comments.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined
    }));
  }

  addComment(paperId: string, content: string, replyToId?: string): Observable<Comment> {
    const user = this.getCurrentUser();
    const comment: Comment = {
      id: this.generateId(),
      paperId,
      authorId: user.id,
      authorName: user.name,
      content,
      createdAt: new Date(),
      replyToId,
      reactions: []
    };

    const comments = this.getComments(paperId);
    comments.push(comment);
    this.saveComments(paperId, comments);

    // Update paper comment count
    const papers = this.getSharedPapers();
    const paper = papers.find(p => p.id === paperId);
    if (paper) {
      paper.commentsCount = comments.length;
      this.savePapers(papers);
    }

    // Add activity
    this.addActivity({
      type: 'comment_added',
      userId: user.id,
      userName: user.name,
      description: `commented on "${paper?.title}"`,
      icon: 'comment',
      color: '#9C27B0',
      relatedId: paperId
    });

    return of(comment).pipe(delay(300));
  }

  addReaction(paperId: string, commentId: string, emoji: string): void {
    const comments = this.getComments(paperId);
    const comment = comments.find(c => c.id === commentId);
    const user = this.getCurrentUser();

    if (comment) {
      // Remove existing reaction from this user
      comment.reactions = comment.reactions.filter(r => r.userId !== user.id);
      
      // Add new reaction
      comment.reactions.push({
        emoji,
        userId: user.id,
        userName: user.name
      });

      this.saveComments(paperId, comments);
    }
  }

  // ===== Tasks =====

  getTasks(): Task[] {
    const key = `team_${this.currentTeamId}_tasks`;
    const data = localStorage.getItem(key);
    if (!data) return [];

    const tasks = JSON.parse(data);
    return tasks.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
      dueDate: t.dueDate ? new Date(t.dueDate) : undefined
    }));
  }

  createTask(
    title: string,
    description: string,
    assignedTo: string[],
    priority: Task['priority'],
    dueDate?: Date,
    tags: string[] = []
  ): Observable<Task> {
    const user = this.getCurrentUser();
    const task: Task = {
      id: this.generateId(),
      title,
      description,
      assignedTo,
      assignedBy: user.name,
      status: 'todo',
      priority,
      dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags
    };

    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);

    // Add activity
    this.addActivity({
      type: 'task_created',
      userId: user.id,
      userName: user.name,
      description: `created task "${title}"`,
      icon: 'task_alt',
      color: '#00BCD4',
      relatedId: task.id
    });

    return of(task).pipe(delay(500));
  }

  updateTaskStatus(taskId: string, status: Task['status']): void {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date();
      this.saveTasks(tasks);

      // Add activity if completed
      if (status === 'done') {
        const user = this.getCurrentUser();
        this.addActivity({
          type: 'task_completed',
          userId: user.id,
          userName: user.name,
          description: `completed task "${task.title}"`,
          icon: 'check_circle',
          color: '#4CAF50',
          relatedId: taskId
        });
      }
    }
  }

  deleteTask(taskId: string): void {
    let tasks = this.getTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    this.saveTasks(tasks);
  }

  // ===== Activities =====

  getActivities(limit: number = 20): Activity[] {
    const key = `team_${this.currentTeamId}_activities`;
    const data = localStorage.getItem(key);
    if (!data) return [];

    const activities = JSON.parse(data);
    return activities
      .map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp)
      }))
      .sort((a: Activity, b: Activity) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  private addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
    const newActivity: Activity = {
      ...activity,
      id: this.generateId(),
      timestamp: new Date()
    };

    const activities = this.getActivities(100);
    activities.unshift(newActivity);

    const key = `team_${this.currentTeamId}_activities`;
    localStorage.setItem(key, JSON.stringify(activities.slice(0, 100)));
  }

  // ===== Analytics =====

  getAnalytics(): TeamAnalytics {
    const papers = this.getSharedPapers();
    const tasks = this.getTasks();
    const members = this.getTeamMembers();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const papersReadThisWeek = papers.filter(p => 
      p.status === 'read' && p.addedAt > oneWeekAgo
    ).length;

    const totalComments = papers.reduce((sum, paper) => sum + paper.commentsCount, 0);

    const activeMembers = members.filter(m => m.isOnline).length;

    // Find most active member (simplified - just first one)
    const mostActiveMember = members.length > 0 ? members[0].name : 'N/A';

    return {
      totalPapers: papers.length,
      papersReadThisWeek,
      totalComments,
      totalTasks: tasks.length,
      tasksCompleted: tasks.filter(t => t.status === 'done').length,
      activeMembers,
      mostActiveMember,
      papersByStatus: {
        reading: papers.filter(p => p.status === 'reading').length,
        read: papers.filter(p => p.status === 'read').length,
        toReview: papers.filter(p => p.status === 'to-review').length,
        archived: papers.filter(p => p.status === 'archived').length
      },
      tasksByStatus: {
        todo: tasks.filter(t => t.status === 'todo').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        review: tasks.filter(t => t.status === 'review').length,
        done: tasks.filter(t => t.status === 'done').length
      }
    };
  }

  // ===== Utilities =====

  private saveTeams(teams: Team[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(teams));
  }

  private saveMembers(members: TeamMember[]): void {
    const key = `team_${this.currentTeamId}_members`;
    localStorage.setItem(key, JSON.stringify(members));
  }

  private savePapers(papers: SharedPaper[]): void {
    const key = `team_${this.currentTeamId}_papers`;
    localStorage.setItem(key, JSON.stringify(papers));
  }

  private saveComments(paperId: string, comments: Comment[]): void {
    const key = `team_${this.currentTeamId}_comments_${paperId}`;
    localStorage.setItem(key, JSON.stringify(comments));
  }

  private saveTasks(tasks: Task[]): void {
    const key = `team_${this.currentTeamId}_tasks`;
    localStorage.setItem(key, JSON.stringify(tasks));
  }

  private updateTeamMemberCount(): void {
    const teams = this.getAllTeams();
    const team = teams.find(t => t.id === this.currentTeamId);
    if (team) {
      team.memberCount = this.getTeamMembers().length;
      this.saveTeams(teams);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeDemoData(): void {
    const teams = this.getAllTeams();
    if (teams.length === 0) {
      // Create demo team
      const user = this.getCurrentUser();
      const team: Team = {
        id: 'team-demo',
        name: 'Research Lab Team',
        description: 'Collaborative research workspace for our lab',
        createdAt: new Date(),
        createdBy: user.id,
        memberCount: 3
      };
      this.saveTeams([team]);
      this.currentTeamId = team.id;

      // Add demo members
      const demoMembers: TeamMember[] = [
        user,
        {
          id: 'member-2',
          name: 'Dr. Sarah Chen',
          email: 'sarah@university.edu',
          role: 'admin',
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isOnline: true
        },
        {
          id: 'member-3',
          name: 'Prof. James Wilson',
          email: 'james@university.edu',
          role: 'member',
          joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
          isOnline: false
        }
      ];
      this.saveMembers(demoMembers);

      // Add demo papers
      const demoPapers: SharedPaper[] = [
        {
          id: 'paper-1',
          title: 'Machine Learning Applications in Healthcare',
          authors: 'Smith, J., Doe, M.',
          year: 2024,
          addedBy: 'Dr. Sarah Chen',
          addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          commentsCount: 3,
          tags: ['AI', 'Healthcare', 'Deep Learning'],
          status: 'read'
        },
        {
          id: 'paper-2',
          title: 'Quantum Computing: Recent Advances',
          authors: 'Johnson, A., Lee, K.',
          year: 2024,
          addedBy: 'You',
          addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          commentsCount: 1,
          tags: ['Quantum', 'Computing'],
          status: 'reading'
        }
      ];
      this.savePapers(demoPapers);

      // Add demo tasks
      const demoTasks: Task[] = [
        {
          id: 'task-1',
          title: 'Review literature on AI ethics',
          description: 'Compile papers on ethical considerations in AI',
          assignedTo: ['member-2'],
          assignedBy: user.name,
          status: 'in-progress',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          tags: ['Research', 'Ethics']
        },
        {
          id: 'task-2',
          title: 'Prepare grant proposal draft',
          description: 'First draft of NSF grant application',
          assignedTo: ['user-1', 'member-3'],
          assignedBy: 'Dr. Sarah Chen',
          status: 'todo',
          priority: 'urgent',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          tags: ['Grant', 'Writing']
        }
      ];
      this.saveTasks(demoTasks);
    }
  }
}
