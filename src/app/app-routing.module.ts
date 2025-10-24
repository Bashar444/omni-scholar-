import { SampleDashboardComponent } from './theme/sample-dashboard.component';

const routes: Routes = [
  { path: 'clarity-dashboard', component: SampleDashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
];

export const appRoutes = RouterModule.forRoot(routes);