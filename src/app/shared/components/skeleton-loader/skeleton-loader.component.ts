import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'card' | 'list-item' | 'text' | 'avatar' | 'rectangle' | 'circle';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-loader" [ngClass]="'skeleton-' + type" [style.width]="width" [style.height]="height">
      <div class="skeleton-shimmer"></div>
    </div>
  `,
  styles: [`
    .skeleton-loader {
      background: linear-gradient(90deg, #f0f0f0 0%, #f8f8f8 50%, #f0f0f0 100%);
      background-size: 200% 100%;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .skeleton-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.5) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      animation: shimmer-slide 1.5s ease-in-out infinite;
    }

    @keyframes shimmer-slide {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .skeleton-card {
      min-height: 200px;
      border-radius: 8px;
    }

    .skeleton-list-item {
      min-height: 60px;
      margin-bottom: 8px;
    }

    .skeleton-text {
      height: 16px;
      margin-bottom: 8px;
    }

    .skeleton-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .skeleton-circle {
      border-radius: 50%;
    }

    .skeleton-rectangle {
      border-radius: 4px;
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'rectangle';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
}
