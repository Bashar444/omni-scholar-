import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningService } from './services/learning.service';
import {
  Course,
  MentorProfile,
  MentorshipSession,
  LearningProgress,
  UserStats,
  CourseCategory,
  DifficultyLevel,
  DIFFICULTY_COLORS,
  CATEGORY_ICONS
} from './models/learning.model';

// ✅ PrimeNG UI Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TabViewModule } from 'primeng/tabview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

import { AvatarModule } from 'primeng/avatar';
import { RatingModule } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-edu-forge',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,

    // ✅ PrimeNG modules replacing Angular Material
    CardModule,
    ButtonModule,
    ChipModule,
    InputTextModule,
    DropdownModule,
    TabViewModule,
    ProgressSpinnerModule,
    ProgressBarModule,
    ToastModule,
    BadgeModule,
    TooltipModule,
    MultiSelectModule,
    InputGroupModule,
    AvatarModule,
    RatingModule,
    DividerModule,
    TagModule
  ],
  templateUrl: './edu-forge.component.html',
  styleUrls: ['./edu-forge.component.scss'],
  providers: [MessageService]
})
export class EduForgeComponent implements OnInit {
  // State signals
  courses = signal<Course[]>([]);
  mentors = signal<MentorProfile[]>([]);
  userProgress = signal<LearningProgress[]>([]);
  mySessions = signal<MentorshipSession[]>([]);
  userStats = signal<UserStats | null>(null);
  isLoading = signal(false);

  // Search and filter
  searchQuery = '';
  mentorSearchQuery = '';
  selectedCategories: CourseCategory[] = [];
  selectedDifficulties: DifficultyLevel[] = [];

  // Constants
  categories: CourseCategory[] = [
    'biology', 'physics', 'chemistry', 'medicine', 
    'computer-science', 'engineering', 'social-sciences', 
    'mathematics', 'other'
  ];
  difficulties: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

  // Mock user ID
  private readonly currentUserId = 'user_current';

  // Tab handling
  activeTabIndex = 0;

  onTabChange(event: { index: number }) {
    this.activeTabIndex = event.index;
  }

  // Computed filtered courses
  filteredCourses = computed(() => {
    let result = this.courses();

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.topics.some(topic => topic.toLowerCase().includes(query)) ||
        course.instructor.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategories.length > 0) {
      result = result.filter(c => this.selectedCategories.includes(c.category));
    }

    if (this.selectedDifficulties.length > 0) {
      result = result.filter(c => this.selectedDifficulties.includes(c.difficulty));
    }

    return result;
  });

  // Computed filtered mentors
  filteredMentors = computed(() => {
    let result = this.mentors();

    if (this.mentorSearchQuery.trim()) {
      const query = this.mentorSearchQuery.toLowerCase();
      result = result.filter(mentor =>
        mentor.name.toLowerCase().includes(query) ||
        mentor.bio.toLowerCase().includes(query) ||
        mentor.expertise.some(e => e.toLowerCase().includes(query)) ||
        mentor.researchAreas.some(r => r.toLowerCase().includes(query))
      );
    }

    return result;
  });

  constructor(
    private learningService: LearningService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    this.learningService.getAllCourses().subscribe(courses => {
      this.courses.set(courses);
    });

    this.learningService.getAllMentors().subscribe(mentors => {
      this.mentors.set(mentors);
    });

    this.learningService.getUserProgress(this.currentUserId).subscribe(progress => {
      this.userProgress.set(progress);
    });

    this.learningService.getMentorshipSessions(this.currentUserId, 'mentee').subscribe(sessions => {
      this.mySessions.set(sessions);
    });

    this.learningService.getUserStats(this.currentUserId).subscribe(stats => {
      this.userStats.set(stats);
      this.isLoading.set(false);
    });
  }

  // Course operations
  searchCourses() {
    const filters: any = {};
    if (this.selectedCategories.length > 0) filters.categories = this.selectedCategories;
    if (this.selectedDifficulties.length > 0) filters.difficulties = this.selectedDifficulties;

    if (this.searchQuery.trim() || Object.keys(filters).length > 0) {
      this.learningService.searchCourses(this.searchQuery, filters).subscribe(courses => {
        this.courses.set(courses);
      });
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.selectedDifficulties = [];
    this.loadData();
  }

  viewCourse(course: Course) {
    this.messageService.add({ severity: 'info', summary: 'Viewing', detail: course.title });
  }

  enrollCourse(courseId: string) {
    this.learningService.enrollInCourse(courseId, this.currentUserId).subscribe(progress => {
      this.userProgress.set([...this.userProgress(), progress]);
      this.messageService.add({ severity: 'success', summary: 'Enrolled', detail: 'Successfully enrolled in course!' });
      this.learningService.getUserStats(this.currentUserId).subscribe(stats => {
        this.userStats.set(stats);
      });
    });
  }

  continueCourse(courseId: string) {
    this.messageService.add({ severity: 'info', summary: 'Continue', detail: 'Continuing course...' });
  }

  // Mentor operations
  searchMentors() {
    if (this.mentorSearchQuery.trim()) {
      this.learningService.searchMentors(this.mentorSearchQuery).subscribe(mentors => {
        this.mentors.set(mentors);
      });
    }
  }

  viewMentor(mentor: MentorProfile) {
    this.messageService.add({ severity: 'info', summary: 'Viewing Mentor', detail: mentor.name });
  }

  requestMentorship(mentor: MentorProfile) {
    this.messageService.add({ severity: 'warn', summary: 'Request Sent', detail: `Requesting session with ${mentor.name}` });
  }

  // Session operations
  cancelSession(sessionId: string) {
    if (confirm('Are you sure you want to cancel this session?')) {
      this.learningService.updateSessionStatus(sessionId, 'cancelled').subscribe(() => {
        this.mySessions.set(
          this.mySessions().map(s => s.id === sessionId ? { ...s, status: 'cancelled' } : s)
        );
        this.messageService.add({ severity: 'error', summary: 'Cancelled', detail: 'Session cancelled' });
      });
    }
  }

  rateSession(session: MentorshipSession) {
    this.messageService.add({ severity: 'info', summary: 'Rating', detail: 'Opening rating dialog...' });
  }

  goToCoursesTab() {
    this.messageService.add({ severity: 'info', summary: 'Navigation', detail: 'Showing courses...' });
  }

  goToMentorsTab() {
    this.messageService.add({ severity: 'info', summary: 'Navigation', detail: 'Showing mentors...' });
  }

  // Utility methods
  getDifficultyColor(difficulty: DifficultyLevel): string {
    return DIFFICULTY_COLORS[difficulty];
  }

  getCategoryIcon(category: CourseCategory): string {
    return CATEGORY_ICONS[category];
  }

  formatCategory(category: CourseCategory): string {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  getCourseTitle(courseId: string): string {
    const course = this.courses().find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}
