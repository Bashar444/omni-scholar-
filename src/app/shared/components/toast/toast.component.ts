import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .toast { position: fixed; right: 16px; bottom: 16px; background: #323232; color: #fff; padding: 12px 16px; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,.2); z-index: 1000; }
    .toast.warn { background: #b45000; }
  `],
  template: `
    <div class="toast" [class.warn]="variant==='warn'" *ngIf="message">
      {{ message }}
    </div>
  `
})
export class ToastComponent {
  @Input() message = '';
  @Input() variant: 'info' | 'warn' = 'info';
}
