import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-task-item-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="task-item-skeleton">
      <div class="task-main">
        <app-skeleton-loader type="circle" width="24px" height="24px"></app-skeleton-loader>
        <div class="task-details">
          <app-skeleton-loader type="text" width="200px" height="16px"></app-skeleton-loader>
          <app-skeleton-loader type="text" width="150px" height="14px"></app-skeleton-loader>
        </div>
      </div>
      <div class="task-meta">
        <app-skeleton-loader type="rectangle" width="70px" height="24px"></app-skeleton-loader>
        <app-skeleton-loader type="circle" width="32px" height="32px"></app-skeleton-loader>
      </div>
    </div>
  `,
  styles: [`
    .task-item-skeleton {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: white;
      border-radius: 8px;
      margin-bottom: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .task-main {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      flex: 1;
    }

    .task-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }

    .task-meta {
      display: flex;
      gap: 12px;
      align-items: center;
    }
  `]
})
export class TaskItemSkeletonComponent {}
