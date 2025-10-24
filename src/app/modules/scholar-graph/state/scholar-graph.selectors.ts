import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AVAILABLE_SOURCES, ScholarGraphState } from './scholar-graph.models';
import { scholarGraphFeatureKey } from './scholar-graph.reducer';

export const selectScholarGraphState = createFeatureSelector<ScholarGraphState>(scholarGraphFeatureKey);

export const selectQuery = createSelector(selectScholarGraphState, s => s.query);
export const selectResults = createSelector(selectScholarGraphState, s => s.results);
export const selectLoading = createSelector(selectScholarGraphState, s => s.loading);
export const selectError = createSelector(selectScholarGraphState, s => s.error);
export const selectSelectedSources = createSelector(selectScholarGraphState, s => s.selectedSources);
export const selectAvailableSources = createSelector(selectScholarGraphState, () => AVAILABLE_SOURCES);
