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
        [style]="{
          width: diameter + 'px',
          height: diameter + 'px',
          'stroke-width': strokeWidth + 'px'
        }"
        [styleClass]="spinnerColorClass">
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

    /* Spinner color variants */
    :host ::ng-deep {
      .spinner-primary .p-progress-spinner-circle {
        stroke: var(--primary-color, #3f51b5) !important;
      }

      .spinner-accent .p-progress-spinner-circle {
        stroke: var(--secondary-color, #ff4081) !important;
      }

      .spinner-warn .p-progress-spinner-circle {
        stroke: var(--error-color, #f44336) !important;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  /** The diameter of the spinner in pixels */
  @Input() diameter: number = 50;

  /** The width of the spinner stroke in pixels */
  @Input() strokeWidth: number = 4;

  /** The color variant of the spinner */
  @Input() color: SpinnerColor = 'primary';

  /** Optional loading message to display below the spinner */
  @Input() message?: string;

  /** Whether the spinner should be displayed fullscreen with overlay */
  @Input() fullscreen: boolean = false;

  /** Computed class for the spinner color */
  protected get spinnerColorClass(): string {
    return `spinner-${this.color}`;
  }
}

/** Valid color options for the spinner */
type SpinnerColor = 'primary' | 'accent' | 'warn';
