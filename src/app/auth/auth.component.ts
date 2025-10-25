import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <mat-card-header>
          <div class="logo-section">
            <mat-icon class="logo-icon">hub</mat-icon>
            <h1>OmniScholar</h1>
            <p class="tagline">The Angular-powered Research Universe</p>
          </div>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <!-- Login Tab -->
            <mat-tab label="Login">
              <form class="auth-form" (ngSubmit)="login()" #loginForm="ngForm">
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" [(ngModel)]="loginEmail" name="email" required>
                  <mat-icon matPrefix>email</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword() ? 'password' : 'text'" 
                         [(ngModel)]="loginPassword" name="password" required>
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix type="button" 
                          (click)="hidePassword.set(!hidePassword())">
                    <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                </mat-form-field>

                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="!loginForm.valid || loading()">
                  <mat-icon>login</mat-icon>
                  {{ loading() ? 'Logging in...' : 'Login' }}
                </button>
              </form>
            </mat-tab>

            <!-- Register Tab -->
            <mat-tab label="Register">
              <form class="auth-form" (ngSubmit)="register()" #registerForm="ngForm">
                <mat-form-field appearance="outline">
                  <mat-label>Full Name</mat-label>
                  <input matInput type="text" [(ngModel)]="registerName" name="name" required>
                  <mat-icon matPrefix>person</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" [(ngModel)]="registerEmail" name="email" required>
                  <mat-icon matPrefix>email</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword() ? 'password' : 'text'" 
                         [(ngModel)]="registerPassword" name="password" required>
                  <mat-icon matPrefix>lock</mat-icon>
                  <button mat-icon-button matSuffix type="button" 
                          (click)="hidePassword.set(!hidePassword())">
                    <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                </mat-form-field>

                <button mat-raised-button color="accent" type="submit" 
                        [disabled]="!registerForm.valid || loading()">
                  <mat-icon>person_add</mat-icon>
                  {{ loading() ? 'Creating account...' : 'Register' }}
                </button>
              </form>
            </mat-tab>
          </mat-tab-group>

          <div class="demo-note">
            <mat-icon>info</mat-icon>
            <p>Demo mode: Use any email/password to login</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, var(--omni-primary) 0%, var(--omni-accent) 100%);
      padding: var(--spacing-lg);
    }

    .auth-card {
      width: 100%;
      max-width: 450px;
      box-shadow: var(--shadow-xl);
    }

    .logo-section {
      text-align: center;
      width: 100%;
      padding: var(--spacing-lg) 0;

      .logo-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--omni-primary);
        margin-bottom: var(--spacing-sm);
      }

      h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 600;
        color: var(--omni-text-primary);
      }

      .tagline {
        margin: var(--spacing-xs) 0 0;
        font-size: 14px;
        color: var(--omni-text-secondary);
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      padding: var(--spacing-lg) 0;

      mat-form-field {
        width: 100%;
      }

      button[type="submit"] {
        width: 100%;
        padding: var(--spacing-md);
        font-size: 16px;
        font-weight: 500;
      }
    }

    .demo-note {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background: var(--omni-primary-light);
      border-radius: 8px;
      margin-top: var(--spacing-md);

      mat-icon {
        color: var(--omni-primary);
      }

      p {
        margin: 0;
        font-size: 14px;
        color: var(--omni-text-secondary);
      }
    }
  `]
})
export class AuthComponent {
  // Login form
  loginEmail = '';
  loginPassword = '';

  // Register form
  registerName = '';
  registerEmail = '';
  registerPassword = '';

  // UI state
  hidePassword = signal(true);
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.loading.set(true);
    
    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/scholar-graph']);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  register(): void {
    this.loading.set(true);
    
    this.authService.register(this.registerEmail, this.registerPassword, this.registerName).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/scholar-graph']);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
