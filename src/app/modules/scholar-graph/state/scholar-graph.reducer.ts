import { createReducer, on } from '@ngrx/store';
import { initialScholarGraphState } from './scholar-graph.models';
import { searchPapers, searchPapersFailure, searchPapersSuccess, setSelectedSources, toggleSource } from './scholar-graph.actions';

export const scholarGraphFeatureKey = 'scholarGraph';

export const scholarGraphReducer = createReducer(
  initialScholarGraphState,
  on(searchPapers, (state, { query }) => ({
    ...state,
    query,
    loading: true,
    error: null,
    results: []
  })),
  on(searchPapersSuccess, (state, { results }) => ({
    ...state,
    loading: false,
    results
  })),
  on(searchPapersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(setSelectedSources, (state, { sources }) => ({
    ...state,
    selectedSources: sources,
    // clear results when filters change; next search will refill
    results: []
  })),
  on(toggleSource, (state, { source }) => {
    const exists = state.selectedSources.includes(source);
    const selectedSources = exists
      ? state.selectedSources.filter(s => s !== source)
      : [...state.selectedSources, source];
    return { ...state, selectedSources, results: [] };
  })
);
