import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { scholarGraphFeatureKey, scholarGraphReducer } from './modules/scholar-graph/state/scholar-graph.reducer';
import { ScholarGraphEffects } from './modules/scholar-graph/state/scholar-graph.effects';
import { routeGuard } from './core/guards/route.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: '/scholar-graph',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		loadComponent: () => import('./auth/auth.component').then(c => c.AuthComponent)
	},
	{
		path: 'scholar-graph',
		loadComponent: () => import('./modules/scholar-graph/scholar-graph.component').then(c => c.ScholarGraphComponent),
		providers: [
			provideState(scholarGraphFeatureKey, scholarGraphReducer),
			provideEffects([ScholarGraphEffects])
		]
	},
	{
		path: 'citation-network',
		loadComponent: () => import('./modules/scholar-graph/citation-network.component').then(c => c.CitationNetworkComponent)
	},
	{
		path: 'scholar-graph/:source/:id',
		loadComponent: () => import('./modules/scholar-graph/paper-detail.component').then(c => c.PaperDetailComponent),
		// Skip prerender for dynamic routes
	},
	{
		path: 'library',
		loadComponent: () => import('./modules/library/library.component').then(c => c.LibraryComponent)
	},
	{
		path: 'paper-pilot',
		loadComponent: () => import('./modules/paper-pilot/paper-pilot.component').then(c => c.PaperPilotComponent)
	},
	{
		path: 'lab-sync',
			loadComponent: () => import('./modules/lab-sync/lab-sync.component').then(c => c.LabSyncComponent),
			canActivate: [routeGuard],
			data: {
				requiresAuth: true,
				roles: ['researcher', 'admin'],
				rateLimitProtected: true
			}
	},
	{
		path: 'grant-ai',
		loadComponent: () => import('./modules/grant-ai/grant-ai.component').then(c => c.GrantAiComponent)
	},
	{
		path: 'rate-limit',
		loadComponent: () => import('./shared/components/rate-limit/rate-limit.component').then(c => c.RateLimitComponent)
	},
	{
		path: '403',
		loadComponent: () => import('./shared/components/forbidden/forbidden.component').then(c => c.ForbiddenComponent)
	},
	{
		path: 'meta-lab',
		loadComponent: () => import('./modules/meta-lab/meta-lab.component').then(c => c.MetaLabComponent)
	},
	{
		path: 'data-verse',
		loadComponent: () => import('./modules/data-verse/data-verse.component').then(c => c.DataVerseComponent)
	},
	{
		path: 'edu-forge',
		loadComponent: () => import('./modules/edu-forge/edu-forge.component').then(c => c.EduForgeComponent)
	},
	{
		path: 'trust-layer',
		loadComponent: () => import('./modules/trust-layer/trust-layer.component').then(c => c.TrustLayerComponent)
	},
	{
		path: 'global-knowledge-bridge',
		loadComponent: () => import('./modules/global-knowledge-bridge/global-knowledge-bridge.component').then(c => c.GlobalKnowledgeBridgeComponent)
	},
	{
		path: 'omni-ai',
			loadComponent: () => import('./modules/omni-ai/omni-ai.component').then(c => c.OmniAiComponent)
	},
	{
		path: '**',
		redirectTo: '/scholar-graph'
	}
];
