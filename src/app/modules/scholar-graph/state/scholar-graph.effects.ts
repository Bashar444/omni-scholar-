import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ScholarGraphService } from '../scholar-graph.service';
import { searchPapers, searchPapersFailure, searchPapersSuccess } from './scholar-graph.actions';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSelectedSources } from './scholar-graph.selectors';

@Injectable()
export class ScholarGraphEffects {
  private actions$ = inject(Actions);
  private service = inject(ScholarGraphService);
  private store = inject(Store);

  search$ = createEffect(() => this.actions$.pipe(
    ofType(searchPapers),
    withLatestFrom(this.store.select(selectSelectedSources)),
    switchMap(([{ query }, sources]) => this.service.search(query, sources).pipe(
      map(results => searchPapersSuccess({ results })),
      catchError(err => of(searchPapersFailure({ error: (err?.message ?? 'Search failed') as string })))
    ))
  ));
}
