import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface RouteData {
  requiresAuth?: boolean;
  roles?: string[];
  rateLimitProtected?: boolean;
}

/**
 * Advanced route guard that handles:
 * - Authentication checks
 * - Role-based access
 * - Rate limiting (509 errors)
 * - Redirect management
 */
export const routeGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Get route requirements from data
  const data = route.data as RouteData;
  const requiresAuth = data.requiresAuth ?? false;
  const allowedRoles = data.roles ?? [];
  const isRateLimitProtected = data.rateLimitProtected ?? false;

  // If route doesn't require auth, allow access
  if (!requiresAuth) {
    return true;
  }

  // Check authentication
  if (!auth.isAuthenticated()) {
    const redirectUrl = state.url;
    return router.createUrlTree(['/auth'], { queryParams: { redirectUrl } });
  }

  // Get current user
  const user = auth.currentUser();
  
  // Check if user exists and has required role
  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return router.createUrlTree(['/403']);
  }

  // If route is protected against rate limiting, check rate limit status
  if (isRateLimitProtected) {
    return auth.checkRateLimit().pipe(
      map(status => {
        if (status.isLimited) {
          // If rate limited, redirect to rate limit page with remaining time
          return router.createUrlTree(['/rate-limit'], {
            queryParams: { 
              remainingTime: status.resetTime,
              redirectUrl: state.url
            }
          });
        }
        return true;
      }),
      catchError(() => {
        // On error checking rate limit, fail safe by allowing access
        console.warn('Failed to check rate limit status, allowing access');
        return of(true);
      })
    );
  }

  return true;
};