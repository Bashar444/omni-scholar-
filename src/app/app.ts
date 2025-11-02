import { Component, signal } from '@angular/core';
import { ShellComponent } from './shell/shell.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent, CommonModule],
  template: `
    <div class="app-wrapper">
      <app-shell ngSkipHydration></app-shell>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .app-wrapper {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class App {
  protected readonly title = signal('omni-scholar-app');
}
