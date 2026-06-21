import { inject } from '@angular/core';
import { Router, RouterStateSnapshot, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { Observable, of } from 'rxjs';
import { map, take, tap, switchMap, filter } from 'rxjs/operators';

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const router: Router = inject(Router);
  const authService: FirebaseAuthService = inject(FirebaseAuthService);

  return authService.isLoggedIn$.pipe(
    take(1),
    switchMap(isLoggedIn => {
      if (isLoggedIn) {
        return of(true);
      }
      // If not logged in locally, wait for the server check to finish
      return authService.authChecked$.pipe(
        filter(checked => checked === true),
        switchMap(() => authService.isLoggedIn$),
        take(1)
      );
    }),
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    })
  );
};

