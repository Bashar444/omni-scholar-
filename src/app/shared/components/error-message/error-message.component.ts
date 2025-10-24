import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// ✅ PrimeNG imports replacing Angular Material UI modules
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { CardModule } from 'primeng/card';

export type ErrorType = 'error' | 'warning' | 'info';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, ButtonModule, ChipModule, CardModule],
  template: `
    <p-card class="error-message" [ngClass]="type">
      <div class="error-content">
        <!-- Replaced mat-icon with p-chip for visual consistency -->
        <p-chip
          [label]="getIconLabel()"
          [styleClass]="'error-chip ' + type">
        </p-chip>

        <div class="error-text">
          @if (title) {
            <h4 class="error-title">{{ title }}</h4>
          }
          <p class="error-description">{{ message }}</p>
        </div>
      </div>

      @if (showRetry) {
        <p-button
          label="Retry"
          icon="pi pi-refresh"
          styleClass="p-button-sm"
          (onClick)="onRetry()">
        </p-button>
      }
    </p-card>
  `,
  styles: [`
    .error-message {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid;
      margin: 1rem 0;
    }

    /* Color theming for message types */
    .error-message.error {
      background: #fef2f2;
      border-color: #fca5a5;
      color: #991b1b;
    }

    .error-message.warning {
      background: #fffbeb;
      border-color: #fcd34d;
      color: #92400e;
    }

    .error-message.info {
      background: #eff6ff;
      border-color: #93c5fd;
      color: #1e40af;
    }

    .error-content {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .error-chip {
      font-weight: bold;
      text-transform: capitalize;
    }

    .error-chip.error {
      background-color: #fecaca;
      color: #991b1b;
    }

    .error-chip.warning {
      background-color: #fde68a;
      color: #92400e;
    }

    .error-chip.info {
      background-color: #bfdbfe;
      color: #1e40af;
    }

    .error-title {
      margin: 0 0 0.5rem 0;
      font-size: 16px;
      font-weight: 600;
    }

    .error-description {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() type: ErrorType = 'error';
  @Input() title?: string;
  @Input() message: string = 'An error occurred';
  @Input() showRetry: boolean = false;
  @Input() onRetryClick?: () => void;

  getIconLabel(): string {
    switch (this.type) {
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return 'Error';
    }
  }

  onRetry(): void {
    if (this.onRetryClick) {
      this.onRetryClick();
    }
  }
}
