import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-rate-limit',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule, ProgressBarModule],
  template: `
    <div class="rate-limit-container">
      <p-card>
        <div class="text-center">
          <i class="pi pi-clock text-5xl text-warning mb-3"></i>
          <h1>Rate Limit Exceeded</h1>
          <p class="mb-4">
            You've reached the maximum number of requests. Please wait before trying again.
          </p>

          <div class="mb-4" *ngIf="remainingTime">
            <p-progressBar
              [value]="progressValue"
              [showValue]="false">
            </p-progressBar>
            <small class="block mt-2">
              Time remaining: {{ formatTime(remainingTime) }}
            </small>
          </div>

          <div class="flex justify-content-center gap-2">
            <p-button
              label="Go Home"
              icon="pi pi-home"
              [routerLink]="['/']">
            </p-button>
            <p-button
              *ngIf="redirectUrl"
              label="Retry"
              icon="pi pi-refresh"
              [routerLink]="[redirectUrl]"
              styleClass="p-button-secondary">
            </p-button>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .rate-limit-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      padding: 2rem;
    }

    .text-center {
      text-align: center;
    }

    .text-warning {
      color: var(--orange-500);
    }

    .mb-3 {
      margin-bottom: 1rem;
    }

    .mb-4 {
      margin-bottom: 1.5rem;
    }

    .mt-2 {
      margin-top: 0.5rem;
    }

    .block {
      display: block;
    }

    .flex {
      display: flex;
    }

    .justify-content-center {
      justify-content: center;
    }

    .gap-2 {
      gap: 0.5rem;
    }
  `]
})
export class RateLimitComponent {
  @Input() remainingTime?: number;
  @Input() redirectUrl?: string;

  get progressValue(): number {
    if (!this.remainingTime) return 0;
    // Assuming max time is 60 seconds for progress calculation
    return Math.max(0, (this.remainingTime / 60) * 100);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}