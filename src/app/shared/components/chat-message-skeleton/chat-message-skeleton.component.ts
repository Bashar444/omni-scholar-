import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-chat-message-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="chat-message-skeleton">
      <div class="message-header">
        <app-skeleton-loader type="circle" width="32px" height="32px"></app-skeleton-loader>
        <app-skeleton-loader type="text" width="100px" height="14px"></app-skeleton-loader>
      </div>
      <div class="message-content">
        <app-skeleton-loader type="text" width="100%"></app-skeleton-loader>
        <app-skeleton-loader type="text" width="95%"></app-skeleton-loader>
        <app-skeleton-loader type="text" width="70%"></app-skeleton-loader>
      </div>
    </div>
  `,
  styles: [`
    .chat-message-skeleton {
      padding: 12px;
      margin-bottom: 12px;
    }

    .message-header {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }

    .message-content {
      padding-left: 44px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `]
})
export class ChatMessageSkeletonComponent {}
