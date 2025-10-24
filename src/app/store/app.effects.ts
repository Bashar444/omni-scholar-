import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { appInitialized } from './app.actions';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);

  logInit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(appInitialized),
        tap(() => {
          // Side-effect placeholder (analytics, warm caches, etc.)
          // console.debug('[NgRx] App initialized');
        })
      ),
    { dispatch: false }
  );
}
