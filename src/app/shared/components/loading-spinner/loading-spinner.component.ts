import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
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

      <p class="loading-message" *ngIf="message">{{ message }}</p>
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
      color: var(--text-color-secondary);
      font-size: 0.9rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 50;
  @Input() strokeWidth: number = 4;
  @Input() message?: string;
  @Input() fullscreen: boolean = false;
  @Input() spinnerColorClass: string = '';

  constructor() {}
}