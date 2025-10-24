import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from './services/team.service';
import { DataExportImportService } from '../../shared/services/data-export-import.service';
import { TaskItemSkeletonComponent } from '../../shared/components/task-item-skeleton/task-item-skeleton.component';

// ✅ PrimeNG UI modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { CalendarModule } from 'primeng/calendar';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import type { MenuItem, SelectItem } from 'primeng/api';

import {
  Team,
  TeamMember,
  SharedPaper,
  Comment,
  Task,
  Activity,
  TeamAnalytics,
  PAPER_STATUSES,
  TASK_PRIORITIES
} from './models/team.model';

@Component({
  selector: 'app-lab-sync',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG UI imports
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
  MultiSelectModule,
    TabViewModule,
    BadgeModule,
    TooltipModule,
    DividerModule,
    DialogModule,
    ProgressBarModule,
    CalendarModule,
    MenuModule,
    ToastModule,

    // Shared components
    TaskItemSkeletonComponent
  ],
  providers: [MessageService],
  templateUrl: './lab-sync.component.html',
  styleUrls: ['./lab-sync.component.scss']
})
export class LabSyncComponent {
  private teamService = new TeamService();
  private dataExportImportService = new DataExportImportService();
  private messageService = new MessageService();

  // ===== State =====
  currentTeam = signal<Team | null>(null);
  currentUser = signal<TeamMember | null>(null);
  members = signal<TeamMember[]>([]);
  papers = signal<SharedPaper[]>([]);
  tasks = signal<Task[]>([]);
  activities = signal<Activity[]>([]);
  analytics = signal<TeamAnalytics | null>(null);
  selectedPaper = signal<SharedPaper | null>(null);
  paperComments = signal<Comment[]>([]);
  isLoading = signal<boolean>(false);

  // ===== Search =====
  searchQuery = '';

  filteredPapers = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.papers();

    return this.papers().filter(paper =>
      paper.title.toLowerCase().includes(query) ||
      paper.authors.toLowerCase().includes(query) ||
      paper.tags.some((t: string) => t.toLowerCase().includes(query)) ||
      paper.addedBy.toLowerCase().includes(query)
    );
  });

  filteredTasks = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.tasks();

    return this.tasks().filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.assignedTo.some((a: string) => a.toLowerCase().includes(query)) ||
      task.assignedBy.toLowerCase().includes(query)
    );
  });

  filteredActivities = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.activities();

    return this.activities().filter(a =>
      a.type.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query) ||
      a.userName.toLowerCase().includes(query)
    );
  });

  // Computed sets
  onlineMembers = computed(() => this.members().filter(m => m.isOnline));
  todayTasks = computed(() => this.filteredTasks().filter(t => t.status !== 'done'));
  doneTasks = computed(() => this.filteredTasks().filter(t => t.status === 'done'));
  todoTasks = computed(() => this.filteredTasks().filter(t => t.status === 'todo'));
  inProgressTasks = computed(() => this.filteredTasks().filter(t => t.status === 'in-progress'));
  reviewTasks = computed(() => this.filteredTasks().filter(t => t.status === 'review'));

  // Constants
  paperStatuses = PAPER_STATUSES;
  taskPriorities = TASK_PRIORITIES;

  // Forms
  newPaperForm = { title: '', authors: '', year: new Date().getFullYear(), tags: '' };
  newTaskForm = {
    title: '',
    description: '',
    assignedTo: [] as string[],
    priority: 'medium' as Task['priority'],
    dueDate: null as Date | null
  };
  newCommentText = '';
  showAddPaperForm = false;
  showAddTaskForm = false;

  constructor() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.loadData();
      this.isLoading.set(false);
    }, 700);
  }

  private loadData() {
    this.currentUser.set(this.teamService.getCurrentUser());
    this.currentTeam.set(this.teamService.getCurrentTeam());
    this.members.set(this.teamService.getTeamMembers());
    this.papers.set(this.teamService.getSharedPapers());
    this.tasks.set(this.teamService.getTasks());
    this.activities.set(this.teamService.getActivities());
    this.analytics.set(this.teamService.getAnalytics());
  }

  // ===== Paper Actions =====
  addPaper() {
    if (!this.newPaperForm.title.trim()) return;

    const tags = this.newPaperForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    this.teamService.addSharedPaper(
      this.newPaperForm.title,
      this.newPaperForm.authors,
      this.newPaperForm.year,
      tags
    ).subscribe(() => {
      this.papers.set(this.teamService.getSharedPapers());
      this.activities.set(this.teamService.getActivities());
      this.analytics.set(this.teamService.getAnalytics());
      this.newPaperForm = { title: '', authors: '', year: new Date().getFullYear(), tags: '' };
      this.showAddPaperForm = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Paper added successfully' });
    });
  }

  selectPaper(paper: SharedPaper) {
    this.selectedPaper.set(paper);
    this.paperComments.set(this.teamService.getComments(paper.id));
  }

  updatePaperStatus(paperId: string, status: SharedPaper['status']) {
    this.teamService.updatePaperStatus(paperId, status);
    this.papers.set(this.teamService.getSharedPapers());
    this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Paper status updated' });
  }

  deletePaper(paperId: string) {
    this.teamService.deletePaper(paperId);
    this.papers.set(this.teamService.getSharedPapers());
    this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Paper removed' });
  }

  // ===== Comment Actions =====
  addComment() {
    const paper = this.selectedPaper();
    if (!paper || !this.newCommentText.trim()) return;

    this.teamService.addComment(paper.id, this.newCommentText).subscribe(() => {
      this.paperComments.set(this.teamService.getComments(paper.id));
      this.newCommentText = '';
      this.messageService.add({ severity: 'success', summary: 'Comment Added', detail: 'Your comment was posted.' });
    });
  }

  // ===== Task Actions =====
  addTask() {
    if (!this.newTaskForm.title.trim()) return;

    this.teamService.createTask(
      this.newTaskForm.title,
      this.newTaskForm.description,
      this.newTaskForm.assignedTo,
      this.newTaskForm.priority,
      this.newTaskForm.dueDate || undefined
    ).subscribe(() => {
      this.tasks.set(this.teamService.getTasks());
      this.newTaskForm = { title: '', description: '', assignedTo: [], priority: 'medium', dueDate: null };
      this.showAddTaskForm = false;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task created successfully' });
    });
  }

  updateTaskStatus(taskId: string, status: Task['status']) {
    this.teamService.updateTaskStatus(taskId, status);
    this.tasks.set(this.teamService.getTasks());
    this.messageService.add({ severity: 'info', summary: 'Task Updated', detail: 'Status updated' });
  }

  deleteTask(taskId: string) {
    this.teamService.deleteTask(taskId);
    this.tasks.set(this.teamService.getTasks());
    this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Task deleted' });
  }

  // ===== Utilities =====
  onSearchChange(): void {
    this.filteredPapers();
    this.filteredTasks();
    this.filteredActivities();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }

  getMemberName(memberId: string): string {
    return this.members().find(m => m.id === memberId)?.name || 'Unknown';
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatTime(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getPriorityConfig(priority: string) {
    const configs: Record<string, { color: string }> = {
      low: { color: '#d1fae5' },
      medium: { color: '#fff7cd' },
      high: { color: '#ffe4e6' }
    };
    return configs[priority] || { color: '#e0e0e0' };
  }

  isOverdue(date?: Date): boolean {
    return !!date && date < new Date();
  }

  // ===== Export/Import =====
  exportData(): void {
    try {
      const data = {
        team: this.currentTeam(),
        members: this.members(),
        papers: this.papers(),
        tasks: this.tasks(),
        activities: this.activities(),
        exportDate: new Date().toISOString()
      };
      this.dataExportImportService.exportModuleData('lab-sync', data);
      this.messageService.add({ severity: 'success', summary: 'Exported', detail: 'Data exported successfully' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Export failed' });
    }
  }

  async importData(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    try {
      const result = await this.dataExportImportService.importData(file, { merge: false });
      if (result.success) {
        this.loadData();
        this.messageService.add({ severity: 'success', summary: 'Imported', detail: result.message });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Warning', detail: result.message });
      }
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Import failed' });
    } finally {
      input.value = '';
    }
  }

  // ===== Menu builders moved out of template to satisfy Angular template parser =====
  getPaperMenuItems(paper: SharedPaper): MenuItem[] {
    const items: MenuItem[] = this.paperStatuses.map(status => ({
      label: `Mark as ${status.label}`,
      icon: `pi pi-${status.icon}`,
      command: () => this.updatePaperStatus(paper.id, status.value),
      style: { color: status.color }
    }));

    items.push({ separator: true });
    items.push({
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.deletePaper(paper.id),
      styleClass: 'text-red-600'
    });

    return items;
  }

  getTaskMenu(task: Task): MenuItem[] {
    // Provide actions depending on current status
    const base: MenuItem[] = [];
    if (task.status === 'todo') {
      base.push({ label: 'Start Task', icon: 'pi pi-play', command: () => this.updateTaskStatus(task.id, 'in-progress') });
    }
    if (task.status === 'in-progress') {
      base.push({ label: 'Move to Review', icon: 'pi pi-comments', command: () => this.updateTaskStatus(task.id, 'review') });
    }
    if (task.status !== 'done') {
      base.push({ label: 'Mark Done', icon: 'pi pi-check', command: () => this.updateTaskStatus(task.id, 'done') });
    }

    base.push({ separator: true });
    base.push({ label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteTask(task.id), styleClass: 'p-error' });
    return base;
  }

  // ===== Comment helpers =====
  addReaction(commentId: string, emoji: string) {
    const p = this.selectedPaper();
    if (!p) return;
    this.teamService.addReaction(p.id, commentId, emoji);
    // refresh comments for selected paper
    this.paperComments.set(this.teamService.getComments(p.id));
  }

  // ===== Select helpers =====
  membersOptions(): SelectItem[] {
    return this.members().map(m => ({ label: m.name, value: m.id }));
  }

  // ===== Status helpers for analytics UI =====
  private normalizeStatusKey(status: string): keyof TeamAnalytics['papersByStatus'] {
    // Our TeamAnalytics uses camelCase keys for 'toReview'
    if (status === 'to-review') return 'toReview';
    return status as keyof TeamAnalytics['papersByStatus'];
  }

  getStatusConfig(status: SharedPaper['status']) {
    return this.paperStatuses.find(s => s.value === status) || { label: status, icon: 'file', color: '#c0c0c0' };
  }

  getStatusCount(stats: TeamAnalytics | null, statusValue: string): number {
    if (!stats) return 0;
    const key = this.normalizeStatusKey(statusValue);
    const count = (stats.papersByStatus as any)[key] || 0;
    const total = stats.totalPapers || 0;
    return total ? Math.round((count / total) * 100) : 0;
  }

  getStatusCountValue(stats: TeamAnalytics | null, statusValue: string): number {
    if (!stats) return 0;
    const key = this.normalizeStatusKey(statusValue);
    return (stats.papersByStatus as any)[key] || 0;
  }
}

