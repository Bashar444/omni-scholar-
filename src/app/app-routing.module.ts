import { Routes } from '@angular/router';
import { SampleDashboardComponent } from './theme/sample-dashboard.component';

export const routes: Routes = [
  { path: 'clarity-dashboard', component: SampleDashboardComponent },
  { path: '', redirectTo: 'clarity-dashboard', pathMatch: 'full' }
];