import { createAction, props } from '@ngrx/store';

export const appInitialized = createAction('[App] Initialized');
export const setLoading = createAction('[App] Set Loading', props<{ loading: boolean }>());
