import { Routes } from '@angular/router';
import { ResearchPaperAnalysisComponent } from './modules/research-paper-analysis/research-paper-analysis.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: '/analysis',
		pathMatch: 'full'
	},
	{
		path: 'analysis',
		component: ResearchPaperAnalysisComponent
	},
	{
		path: '**',
		redirectTo: '/analysis'
	}
];
