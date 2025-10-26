/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import '@angular/compiler';
import { provideRouter, withHashLocation, withComponentInputBinding } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppComponent } from './src/app.component';
import { routes } from './src/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(withFetch()),
  ],
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
