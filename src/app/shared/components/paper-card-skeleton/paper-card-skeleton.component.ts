import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-paper-card-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="paper-card-skeleton">
      <div class="skeleton-header">
        <app-skeleton-loader type="circle" width="40px" height="40px"></app-skeleton-loader>
        <div class="skeleton-header-text">
          <app-skeleton-loader type="text" width="70%"></app-skeleton-loader>
          <app-skeleton-loader type="text" width="50%"></app-skeleton-loader>
        </div>
      </div>
      <div class="skeleton-content">
        <app-skeleton-loader type="text" width="100%"></app-skeleton-loader>
        <app-skeleton-loader type="text" width="90%"></app-skeleton-loader>
        <app-skeleton-loader type="text" width="80%"></app-skeleton-loader>
      </div>
      <div class="skeleton-footer">
        <app-skeleton-loader type="rectangle" width="60px" height="24px"></app-skeleton-loader>
        <app-skeleton-loader type="rectangle" width="80px" height="24px"></app-skeleton-loader>
      </div>
    </div>
  `,
  styles: [`
    .paper-card-skeleton {
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 16px;
    }

    .skeleton-header {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
      align-items: center;
    }

    .skeleton-header-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .skeleton-content {
      margin-bottom: 16px;
    }

    .skeleton-footer {
      display: flex;
      gap: 8px;
    }
  `]
})
export class PaperCardSkeletonComponent {}
