import { Component, signal } from '@angular/core';
import { ShellComponent } from './shell/shell.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShellComponent],
  template: '<app-shell ngSkipHydration></app-shell>',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('omni-scholar-app');
}
