import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// ✅ PrimeNG replacement for MatProgressSpinnerModule
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
    CardModule,
    ButtonModule
  ],
  template: `
    <div class="loading-spinner-container" [class.fullscreen]="fullscreen">
      <p-progressSpinner 
        [style]="{ width: diameter + 'px', height: diameter + 'px' }"
        [strokeWidth]="strokeWidth"
        [styleClass]="color">
      </p-progressSpinner>

      @if (message) {
        <p class="loading-message">{{ message }}</p>
      }
    </div>
  `,
  styles: [`
    .loading-spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
    }

    .loading-spinner-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 9999;
    }

    .loading-message {
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 500;
    }

    /* Optional color variants matching the Material style */
    .primary .p-progress-spinner-circle {
      stroke: #3f51b5 !important;
    }

    .accent .p-progress-spinner-circle {
      stroke: #ff4081 !important;
    }

    .warn .p-progress-spinner-circle {
      stroke: #f44336 !important;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 50;
  @Input() strokeWidth: number = 4;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message?: string;
  @Input() fullscreen: boolean = false;
}
