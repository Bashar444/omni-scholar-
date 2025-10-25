import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    ButtonModule
  ],
  template: `
    <div class="forbidden-container">
      <p-card>
        <div class="text-center">
          <i class="pi pi-lock text-5xl text-danger mb-3"></i>
          <h1>Access Denied</h1>
          <p class="mb-4">
            You don't have permission to access this resource.
          </p>
          <p-button
            label="Go Home"
            icon="pi pi-home"
            [routerLink]="['/']">
          </p-button>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .forbidden-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
      background: var(--surface-ground);
    }

    p-card {
      max-width: 500px;
      width: 100%;
    }
  `]
})
export class ForbiddenComponent {}