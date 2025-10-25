import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'researcher' | 'admin' | 'student';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal-based state (Angular 18+ feature)
  public isAuthenticated = signal(false);
  public currentUser = signal<User | null>(null);

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    this.loadUserFromStorage();
  }

  /**
   * Load user from localStorage on app initialization
   */
  private loadUserFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const storedUser = localStorage.getItem('omni_scholar_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.setUser(user);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        this.clearUser();
      }
    }
  }

  /**
   * Login user with email and password
   * TODO: Integrate with actual backend API
   */
  login(email: string, password: string): Observable<User> {
    // Mock authentication - replace with actual API call
    const mockUser: User = {
      id: '1',
      email,
      name: 'Demo Researcher',
      role: 'researcher',
      avatar: 'https://via.placeholder.com/150'
    };

    this.setUser(mockUser);
    return of(mockUser);
  }

  /**
   * Register new user
   * TODO: Integrate with actual backend API
   */
  register(email: string, password: string, name: string): Observable<User> {
    // Mock registration - replace with actual API call
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'researcher'
    };

    this.setUser(newUser);
    return of(newUser);
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.clearUser();
    this.router.navigate(['/']);
  }

  /**
   * Set current user and update all state
   */
  private setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('omni_scholar_user', JSON.stringify(user));
    }
  }

  /**
   * Clear user and update all state
   */
  private clearUser(): void {
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('omni_scholar_user');
    }
  }

  /**
   * Get current user value (synchronous)
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated (synchronous)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get authentication token
   * TODO: Implement actual JWT token management
   */
  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem('omni_scholar_token');
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('omni_scholar_token', token);
    }
  }

  /**
   * Clear authentication token
   */
  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('omni_scholar_token');
    }
  }

  /**
   * Check rate limit status
   * TODO: Replace with actual API call when backend is integrated
   */
  checkRateLimit(): Observable<{ isLimited: boolean; resetTime?: number }> {
    // Mock implementation - replace with actual API call
    const mockRateLimit = {
      isLimited: false,
      resetTime: 0
    };

    // Read from localStorage to simulate persistence
    if (isPlatformBrowser(this.platformId)) {
      const storedLimit = localStorage.getItem('rate_limit');
      if (storedLimit) {
        const { limitTime } = JSON.parse(storedLimit);
        if (limitTime > Date.now()) {
          return of({
            isLimited: true,
            resetTime: limitTime - Date.now()
          });
        } else {
          localStorage.removeItem('rate_limit');
        }
      }
    }

    return of(mockRateLimit);
  }

  /**
   * Handle rate limit error (509)
   * @param resetTime Time in milliseconds until rate limit resets
   */
  handleRateLimit(resetTime: number): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('rate_limit', JSON.stringify({
        limitTime: Date.now() + resetTime
      }));
    }
  }
}
