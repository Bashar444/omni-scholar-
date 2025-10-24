import { createReducer, on } from '@ngrx/store';
import { appInitialized, setLoading } from './app.actions';
import { AppState, initialAppState } from './app.state';

export const appFeatureKey = 'app';

export const appReducer = createReducer(
  initialAppState,
  on(appInitialized, (state): AppState => ({
    ...state,
    ui: { ...state.ui, initialized: true }
  })),
  on(setLoading, (state, { loading }): AppState => ({
    ...state,
    ui: { ...state.ui, loading }
  }))
);
