import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-rate-limit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule,
    ProgressBarModule
  ],
  template: `
    <div class="rate-limit-container">
      <p-card>
        <div class="text-center">
          <i class="pi pi-clock text-5xl text-warning mb-3"></i>
          <h1>Rate Limit Exceeded</h1>
          <p class="mb-4">
            You've reached the maximum number of requests. Please wait before trying again.
          </p>
          
          @if (remainingTime) {
            <div class="mb-4">
              <p-progressBar 
                [value]="progressValue" 
                [showValue]="false">
              </p-progressBar>
              <small class="block mt-2">
                Time remaining: {{ formatTime(remainingTime) }}
              </small>
            </div>
          }

          <div class="flex justify-content-center gap-2">
            <p-button
              label="Go Home"
              icon="pi pi-home"
              [routerLink]="['/']">
            </p-button>
            @if (redirectUrl) {
              <p-button
                label="Retry"
                icon="pi pi-refresh"
                [routerLink]="[redirectUrl]"
                styleClass="p-button-secondary">
              </p-button>
            }
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
      min-height: 100vh;
      padding: 2rem;
      background: var(--surface-ground);
    }

    p-card {
      max-width: 500px;
      width: 100%;
    }
  `]
})
export class RateLimitComponent {
  remainingTime = 0;
  redirectUrl?: string;
  progressValue = 0;
  private interval: any;

  ngOnInit() {
    // Get parameters from route
    const params = new URLSearchParams(window.location.search);
    this.remainingTime = parseInt(params.get('remainingTime') || '0', 10);
    this.redirectUrl = params.get('redirectUrl') || undefined;

    // Start countdown if time remaining
    if (this.remainingTime > 0) {
      const startTime = this.remainingTime;
      this.updateProgress(startTime);
      
      this.interval = setInterval(() => {
        this.remainingTime -= 1000;
        this.updateProgress(startTime);
        
        if (this.remainingTime <= 0) {
          clearInterval(this.interval);
          if (this.redirectUrl) {
            window.location.href = this.redirectUrl;
          }
        }
      }, 1000);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private updateProgress(startTime: number) {
    this.progressValue = ((startTime - this.remainingTime) / startTime) * 100;
  }

  formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}