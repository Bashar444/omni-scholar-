import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scholar-graph',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="scholar-graph-placeholder">ScholarGraph placeholder</div>`,
  styles: [`.scholar-graph-placeholder { padding: 24px; }`]
})
export class ScholarGraphComponent {}
