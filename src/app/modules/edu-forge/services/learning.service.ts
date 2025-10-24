import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import {
  Course,
  MentorProfile,
  MentorshipRequest,
  MentorshipSession,
  LearningProgress,
  UserStats,
  ForumPost,
  Quiz,
  QuizAttempt,
  Certificate,
  MOCK_COURSES,
  MOCK_MENTORS,
  DifficultyLevel,
  CourseCategory,
  MentorshipStatus,
  SessionStatus
} from '../models/learning.model';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private readonly STORAGE_KEY_COURSES = 'edu_forge_courses';
  private readonly STORAGE_KEY_MENTORS = 'edu_forge_mentors';
  private readonly STORAGE_KEY_PROGRESS = 'edu_forge_progress';
  private readonly STORAGE_KEY_MENTORSHIP_REQUESTS = 'edu_forge_mentorship_requests';
  private readonly STORAGE_KEY_SESSIONS = 'edu_forge_sessions';
  private readonly STORAGE_KEY_FORUM = 'edu_forge_forum';

  private coursesSubject = new BehaviorSubject<Course[]>(this.loadCourses());
  private mentorsSubject = new BehaviorSubject<MentorProfile[]>(this.loadMentors());
  private progressSubject = new BehaviorSubject<LearningProgress[]>(this.loadProgress());
  private mentorshipRequestsSubject = new BehaviorSubject<MentorshipRequest[]>(this.loadMentorshipRequests());
  private sessionsSubject = new BehaviorSubject<MentorshipSession[]>(this.loadSessions());
  private forumPostsSubject = new BehaviorSubject<ForumPost[]>(this.loadForumPosts());

  public courses$ = this.coursesSubject.asObservable();
  public mentors$ = this.mentorsSubject.asObservable();
  public progress$ = this.progressSubject.asObservable();
  public mentorshipRequests$ = this.mentorshipRequestsSubject.asObservable();
  public sessions$ = this.sessionsSubject.asObservable();
  public forumPosts$ = this.forumPostsSubject.asObservable();

  constructor() {}

  // ============================================================================
  // Course Management
  // ============================================================================

  getAllCourses(): Observable<Course[]> {
    return of(this.coursesSubject.value).pipe(delay(400));
  }

  getCourseById(id: string): Observable<Course | undefined> {
    const course = this.coursesSubject.value.find(c => c.id === id);
    return of(course).pipe(delay(200));
  }

  getCoursesByCategory(category: CourseCategory): Observable<Course[]> {
    const courses = this.coursesSubject.value.filter(c => c.category === category);
    return of(courses).pipe(delay(300));
  }

  getCoursesByDifficulty(difficulty: DifficultyLevel): Observable<Course[]> {
    const courses = this.coursesSubject.value.filter(c => c.difficulty === difficulty);
    return of(courses).pipe(delay(300));
  }

  getFeaturedCourses(): Observable<Course[]> {
    const courses = this.coursesSubject.value.filter(c => c.isFeatured);
    return of(courses).pipe(delay(300));
  }

  searchCourses(query: string, filters?: {
    categories?: CourseCategory[];
    difficulties?: DifficultyLevel[];
    minRating?: number;
  }): Observable<Course[]> {
    let results = this.coursesSubject.value;

    // Text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(course =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.description.toLowerCase().includes(lowerQuery) ||
        course.topics.some(topic => topic.toLowerCase().includes(lowerQuery)) ||
        course.instructor.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters
    if (filters) {
      if (filters.categories && filters.categories.length > 0) {
        results = results.filter(c => filters.categories!.includes(c.category));
      }
      if (filters.difficulties && filters.difficulties.length > 0) {
        results = results.filter(c => filters.difficulties!.includes(c.difficulty));
      }
      if (filters.minRating !== undefined) {
        results = results.filter(c => c.rating >= filters.minRating!);
      }
    }

    return of(results).pipe(delay(500));
  }

  createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Observable<Course> {
    const newCourse: Course = {
      ...course,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const courses = [...this.coursesSubject.value, newCourse];
    this.coursesSubject.next(courses);
    this.saveCourses(courses);
    return of(newCourse).pipe(delay(300));
  }

  enrollInCourse(courseId: string, userId: string): Observable<LearningProgress> {
    const course = this.coursesSubject.value.find(c => c.id === courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const progress: LearningProgress = {
      userId,
      courseId,
      enrolledAt: new Date(),
      completedLessons: [],
      totalLessons: course.lessonsCount,
      completedQuizzes: [],
      totalQuizzes: course.quizzes.length,
      progressPercentage: 0,
      lastAccessedAt: new Date()
    };

    const allProgress = [...this.progressSubject.value, progress];
    this.progressSubject.next(allProgress);
    this.saveProgress(allProgress);

    // Update enrolled count
    const updatedCourses = this.coursesSubject.value.map(c =>
      c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c
    );
    this.coursesSubject.next(updatedCourses);
    this.saveCourses(updatedCourses);

    return of(progress).pipe(delay(400));
  }

  // ============================================================================
  // Mentorship Management
  // ============================================================================

  getAllMentors(): Observable<MentorProfile[]> {
    return of(this.mentorsSubject.value).pipe(delay(400));
  }

  getMentorById(id: string): Observable<MentorProfile | undefined> {
    const mentor = this.mentorsSubject.value.find(m => m.id === id);
    return of(mentor).pipe(delay(200));
  }

  getFeaturedMentors(): Observable<MentorProfile[]> {
    const mentors = this.mentorsSubject.value.filter(m => m.isFeatured);
    return of(mentors).pipe(delay(300));
  }

  searchMentors(query: string, filters?: {
    expertise?: string[];
    minRating?: number;
    maxRate?: number;
  }): Observable<MentorProfile[]> {
    let results = this.mentorsSubject.value;

    // Text search
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(mentor =>
        mentor.name.toLowerCase().includes(lowerQuery) ||
        mentor.bio.toLowerCase().includes(lowerQuery) ||
        mentor.expertise.some(e => e.toLowerCase().includes(lowerQuery)) ||
        mentor.researchAreas.some(r => r.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.expertise && filters.expertise.length > 0) {
        results = results.filter(m =>
          filters.expertise!.some(e => m.expertise.includes(e))
        );
      }
      if (filters.minRating !== undefined) {
        results = results.filter(m => m.rating >= filters.minRating!);
      }
      if (filters.maxRate !== undefined) {
        results = results.filter(m => (m.hourlyRate || 0) <= filters.maxRate!);
      }
    }

    return of(results).pipe(delay(500));
  }

  requestMentorship(request: Omit<MentorshipRequest, 'id' | 'createdAt'>): Observable<MentorshipRequest> {
    const newRequest: MentorshipRequest = {
      ...request,
      id: this.generateId(),
      createdAt: new Date()
    };

    const requests = [...this.mentorshipRequestsSubject.value, newRequest];
    this.mentorshipRequestsSubject.next(requests);
    this.saveMentorshipRequests(requests);
    return of(newRequest).pipe(delay(300));
  }

  updateMentorshipRequest(id: string, updates: Partial<MentorshipRequest>): Observable<MentorshipRequest> {
    const requests = this.mentorshipRequestsSubject.value.map(req =>
      req.id === id ? { ...req, ...updates, respondedAt: new Date() } : req
    );
    this.mentorshipRequestsSubject.next(requests);
    this.saveMentorshipRequests(requests);
    const updatedRequest = requests.find(r => r.id === id)!;
    return of(updatedRequest).pipe(delay(300));
  }

  scheduleMentorshipSession(session: Omit<MentorshipSession, 'id'>): Observable<MentorshipSession> {
    const newSession: MentorshipSession = {
      ...session,
      id: this.generateId()
    };

    const sessions = [...this.sessionsSubject.value, newSession];
    this.sessionsSubject.next(sessions);
    this.saveSessions(sessions);
    return of(newSession).pipe(delay(300));
  }

  getMentorshipSessions(userId: string, role: 'mentor' | 'mentee'): Observable<MentorshipSession[]> {
    const sessions = this.sessionsSubject.value.filter(s =>
      role === 'mentor' ? s.mentorId === userId : s.menteeId === userId
    );
    return of(sessions).pipe(delay(300));
  }

  updateSessionStatus(sessionId: string, status: SessionStatus): Observable<MentorshipSession> {
    const sessions = this.sessionsSubject.value.map(s =>
      s.id === sessionId ? { ...s, status } : s
    );
    this.sessionsSubject.next(sessions);
    this.saveSessions(sessions);
    const updatedSession = sessions.find(s => s.id === sessionId)!;
    return of(updatedSession).pipe(delay(300));
  }

  // ============================================================================
  // Progress Tracking
  // ============================================================================

  getUserProgress(userId: string): Observable<LearningProgress[]> {
    const progress = this.progressSubject.value.filter(p => p.userId === userId);
    return of(progress).pipe(delay(300));
  }

  getCourseProgress(userId: string, courseId: string): Observable<LearningProgress | undefined> {
    const progress = this.progressSubject.value.find(
      p => p.userId === userId && p.courseId === courseId
    );
    return of(progress).pipe(delay(200));
  }

  updateLessonProgress(userId: string, courseId: string, lessonId: string): Observable<LearningProgress> {
    const progressList = this.progressSubject.value.map(p => {
      if (p.userId === userId && p.courseId === courseId) {
        const completedLessons = [...new Set([...p.completedLessons, lessonId])];
        const progressPercentage = Math.round(
          ((completedLessons.length + p.completedQuizzes.length) / (p.totalLessons + p.totalQuizzes)) * 100
        );
        return {
          ...p,
          completedLessons,
          progressPercentage,
          lastAccessedAt: new Date()
        };
      }
      return p;
    });
    
    this.progressSubject.next(progressList);
    this.saveProgress(progressList);
    const updated = progressList.find(p => p.userId === userId && p.courseId === courseId)!;
    return of(updated).pipe(delay(300));
  }

  updateQuizProgress(userId: string, courseId: string, quizId: string): Observable<LearningProgress> {
    const progressList = this.progressSubject.value.map(p => {
      if (p.userId === userId && p.courseId === courseId) {
        const completedQuizzes = [...new Set([...p.completedQuizzes, quizId])];
        const progressPercentage = Math.round(
          ((p.completedLessons.length + completedQuizzes.length) / (p.totalLessons + p.totalQuizzes)) * 100
        );
        return {
          ...p,
          completedQuizzes,
          progressPercentage,
          lastAccessedAt: new Date()
        };
      }
      return p;
    });
    
    this.progressSubject.next(progressList);
    this.saveProgress(progressList);
    const updated = progressList.find(p => p.userId === userId && p.courseId === courseId)!;
    return of(updated).pipe(delay(300));
  }

  getUserStats(userId: string): Observable<UserStats> {
    const userProgress = this.progressSubject.value.filter(p => p.userId === userId);
    
    const stats: UserStats = {
      userId,
      coursesEnrolled: userProgress.length,
      coursesCompleted: userProgress.filter(p => p.progressPercentage === 100).length,
      certificatesEarned: userProgress.filter(p => p.certificateEarned).length,
      totalLearningTime: userProgress.reduce((sum, p) => sum + (p.completedLessons.length * 30), 0), // Estimate
      averageQuizScore: 85, // Mock value
      currentStreak: 5,
      longestStreak: 12,
      mentorshipSessions: this.sessionsSubject.value.filter(s => s.menteeId === userId).length
    };

    return of(stats).pipe(delay(400));
  }

  // ============================================================================
  // Forum Management
  // ============================================================================

  getForumPosts(courseId?: string): Observable<ForumPost[]> {
    let posts = this.forumPostsSubject.value;
    if (courseId) {
      posts = posts.filter(p => p.courseId === courseId);
    }
    return of(posts).pipe(delay(400));
  }

  createForumPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt'>): Observable<ForumPost> {
    const newPost: ForumPost = {
      ...post,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const posts = [...this.forumPostsSubject.value, newPost];
    this.forumPostsSubject.next(posts);
    this.saveForumPosts(posts);
    return of(newPost).pipe(delay(300));
  }

  // ============================================================================
  // LocalStorage Helpers
  // ============================================================================

  private loadCourses(): Course[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_COURSES);
    if (stored) {
      const courses = JSON.parse(stored);
      return courses.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }));
    }
    return MOCK_COURSES;
  }

  private saveCourses(courses: Course[]): void {
    localStorage.setItem(this.STORAGE_KEY_COURSES, JSON.stringify(courses));
  }

  private loadMentors(): MentorProfile[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_MENTORS);
    if (stored) {
      const mentors = JSON.parse(stored);
      return mentors.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      }));
    }
    return MOCK_MENTORS;
  }

  private saveMentors(mentors: MentorProfile[]): void {
    localStorage.setItem(this.STORAGE_KEY_MENTORS, JSON.stringify(mentors));
  }

  private loadProgress(): LearningProgress[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_PROGRESS);
    if (stored) {
      const progress = JSON.parse(stored);
      return progress.map((p: any) => ({
        ...p,
        enrolledAt: new Date(p.enrolledAt),
        lastAccessedAt: new Date(p.lastAccessedAt)
      }));
    }
    return [];
  }

  private saveProgress(progress: LearningProgress[]): void {
    localStorage.setItem(this.STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  }

  private loadMentorshipRequests(): MentorshipRequest[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_MENTORSHIP_REQUESTS);
    if (stored) {
      const requests = JSON.parse(stored);
      return requests.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        respondedAt: r.respondedAt ? new Date(r.respondedAt) : undefined,
        proposedTime: r.proposedTime ? new Date(r.proposedTime) : undefined
      }));
    }
    return [];
  }

  private saveMentorshipRequests(requests: MentorshipRequest[]): void {
    localStorage.setItem(this.STORAGE_KEY_MENTORSHIP_REQUESTS, JSON.stringify(requests));
  }

  private loadSessions(): MentorshipSession[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_SESSIONS);
    if (stored) {
      const sessions = JSON.parse(stored);
      return sessions.map((s: any) => ({
        ...s,
        scheduledAt: new Date(s.scheduledAt),
        completedAt: s.completedAt ? new Date(s.completedAt) : undefined
      }));
    }
    return [];
  }

  private saveSessions(sessions: MentorshipSession[]): void {
    localStorage.setItem(this.STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }

  private loadForumPosts(): ForumPost[] {
    const stored = localStorage.getItem(this.STORAGE_KEY_FORUM);
    if (stored) {
      const posts = JSON.parse(stored);
      return posts.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        replies: p.replies.map((r: any) => ({
          ...r,
          createdAt: new Date(r.createdAt)
        }))
      }));
    }
    return [];
  }

  private saveForumPosts(posts: ForumPost[]): void {
    localStorage.setItem(this.STORAGE_KEY_FORUM, JSON.stringify(posts));
  }

  private generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9);
  }
}
