// theme.service.ts
// Angular service for Clarity Theme management
// Provides theme switching, palette observables, and CSS variable application

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ClarityThemeMode = 'light' | 'dark' | 'high-contrast';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private mode$ = new BehaviorSubject<ClarityThemeMode>('light');
  readonly modeObservable = this.mode$.asObservable();

  constructor() {
    const saved = localStorage.getItem('clarity-theme-mode') as ClarityThemeMode;
    if (saved) this.setMode(saved);
    this.applyTheme(this.mode$.value);
  }

  setMode(mode: ClarityThemeMode) {
    this.mode$.next(mode);
    localStorage.setItem('clarity-theme-mode', mode);
    this.applyTheme(mode);
  }

  toggleMode() {
    const next = this.mode$.value === 'light' ? 'dark' : 'light';
    this.setMode(next);
  }

  setHighContrast(enabled: boolean) {
    if (enabled) {
      document.body.classList.add('high-contrast');
      this.setMode('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
      this.setMode('light');
    }
  }

  private applyTheme(mode: ClarityThemeMode) {
    document.body.classList.remove('light', 'dark', 'high-contrast');
    document.body.classList.add(mode);
    // Optionally: set CSS variables for palette here
  }
}
