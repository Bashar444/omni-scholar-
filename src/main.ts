import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => {
    // Log hydration errors but don't break the app
    if (err?.message?.includes('NG0908') || err?.message?.includes('hydration')) {
      console.warn('Hydration mismatch detected - this is expected for client-side only apps');
    } else {
      console.error(err);
    }
  });

// Trigger deployment
