## Omni-Scholar — Quick guide for AI coding agents

This repository is an Angular 20 application using standalone components, NgRx, Apollo (GraphQL) and PrimeNG. The goal of these notes is to make an AI coding assistant immediately productive and reduce noisy suggestions.

- Project entry points
  - `src/main.ts` — bootstraps the app with `bootstrapApplication(App, appConfig)` (standalone approach).
  - `src/app/app.config.ts` — central ApplicationConfig (providers: router, http client, animations, NgRx store/effects).
  - `src/app/app.routes.ts` — lazy route definitions (uses `loadComponent` and per-route `providers` like `provideState`).

- Build / run / test
  - Local dev: `npm start` (runs `ng serve` — default host http://localhost:4200).
  - Production build: `npm run build` (runs `ng build`). `angular.json` sets `baseHref` to `/omn/` — update this for root deployments.
  - Tests: `npm test` (Karma). SSR: `npm run serve:ssr:omni-scholar-app` runs `node dist/omni-scholar-app/server/server.mjs`.
  - Vercel: `vercel.json` expects static build output in `dist/omni-scholar-app/browser`; the build uses `@vercel/static-build`.

- Key structural patterns to follow
  - Standalone components: Many components are `standalone: true` and use `imports: [...]` in the `@Component` decorator. When adding a new component intended for lazy loading, mark it `standalone: true` and export it with `loadComponent` in routes.
    - Example: `ShellComponent` (src/app/shell) uses `standalone: true` and imports PrimeNG modules.
  - Lazy routes: Add routes in `src/app/app.routes.ts` using `loadComponent`. If that route maintains local NgRx state/effects, add `providers` with `provideState` and `provideEffects` like existing `scholar-graph` route.
  - State: Root store is provided in `app.config.ts` (`provideStore({ app: appReducer })`) — feature slices live next to modules under `src/app/modules/*/state`.
  - HTTP: App uses the Angular `HttpClient` with `withFetch()` and DI interceptors. GraphQL is done via `@apollo/client` + `apollo-angular` in module code.

- Common gotchas observed in this codebase
  - Component decorator typos: use `styleUrls` (array) not `styleUrl`. Standalone components that use `imports` must declare `standalone: true` (see `src/app/app.ts` fix).
  - `baseHref` is set to `/omn/` in `angular.json`. For a Vercel root deployment, either change baseHref to `/` or set up correct routing rewrites. The repo's `vercel.json` rewrites everything to `index.html` which assumes root hosting.
  - Static output: `angular.json` uses `outputMode: static` (good for static hosts). `vercel.json` expects `dist/omni-scholar-app/browser` — confirm the build produces this path.

- When making changes, prefer small commits and run these checks
  1. `npm ci` (or install) to ensure deps are present.
 2. `npm run build` — resolve TypeScript/Angular compile errors.
 3. `npm test` — fix failing unit tests where relevant.

- Where to look for examples
  - Routing + providers: `src/app/app.routes.ts`
  - App bootstrap & providers: `src/main.ts`, `src/app/app.config.ts`
  - Shell + UI patterns: `src/app/shell/*` (PrimeNG usage)
  - Feature module state: `src/app/modules/*/state/*` (NgRx reducers/effects)

If you need me to modify code, run builds, or prepare commits, specify whether I should push to the remote repository and provide credentials (or a deploy key / GitHub token). For a Vercel deploy I will need either a Vercel token or for you to connect the repo in the Vercel dashboard.
