import { createAction, props } from '@ngrx/store';
import { PaperResult, Source } from './scholar-graph.models';

export const searchPapers = createAction(
  '[ScholarGraph] Search Papers',
  props<{ query: string }>()
);

export const searchPapersSuccess = createAction(
  '[ScholarGraph] Search Papers Success',
  props<{ results: PaperResult[] }>()
);

export const searchPapersFailure = createAction(
  '[ScholarGraph] Search Papers Failure',
  props<{ error: string }>()
);

export const setSelectedSources = createAction(
  '[ScholarGraph] Set Selected Sources',
  props<{ sources: Source[] }>()
);

export const toggleSource = createAction(
  '[ScholarGraph] Toggle Source',
  props<{ source: Source }>()
);
