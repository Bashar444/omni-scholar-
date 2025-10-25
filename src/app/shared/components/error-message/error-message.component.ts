import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChipModule],
  template: `
    <p-card class="error-message" [ngClass]="type">
      <div class="error-content">
        <p-chip
          [label]="getIconLabel()"
          [styleClass]="'error-chip ' + type">
        </p-chip>

        <div class="error-text">
          <h4 class="error-title" *ngIf="title">{{ title }}</h4>
          <p class="error-description">{{ message }}</p>
        </div>
      </div>

      <p-button
        *ngIf="showRetry"
        label="Retry"
        icon="pi pi-refresh"
        styleClass="p-button-sm"
        (onClick)="onRetry()">
      </p-button>
    </p-card>
  `,
  styles: [`
    .error-message {
      margin: 1rem 0;
    }

    .error-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .error-text {
      flex: 1;
    }

    .error-title {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .error-description {
      margin: 0;
      color: var(--text-color-secondary);
    }

    .error-chip {
      flex-shrink: 0;
    }

    .error-message.error .error-chip {
      background-color: var(--red-100);
      color: var(--red-700);
    }

    .error-message.warning .error-chip {
      background-color: var(--orange-100);
      color: var(--orange-700);
    }

    .error-message.info .error-chip {
      background-color: var(--blue-100);
      color: var(--blue-700);
    }
  `]
})
export class ErrorMessageComponent {
  @Input() type: 'error' | 'warning' | 'info' = 'error';
  @Input() title?: string;
  @Input() message: string = '';
  @Input() showRetry: boolean = false;
  @Output() retry = new EventEmitter<void>();

  getIconLabel(): string {
    switch (this.type) {
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Info';
      default:
        return 'Error';
    }
  }

  onRetry(): void {
    this.retry.emit();
  }
}