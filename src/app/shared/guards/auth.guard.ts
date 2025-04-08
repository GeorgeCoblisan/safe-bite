import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { combineLatest, filter, map, take, tap } from 'rxjs';

import { AuthService } from '../auth/services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const navCtrl = inject(NavController);

  return combineLatest([
    authService.isUserLoggedIn(),
    authService.isSessionChecked$,
  ]).pipe(
    filter(([_, checked]) => checked),
    take(1),
    tap(([isLoggedIn]) => {
      if (!isLoggedIn) {
        navCtrl.navigateForward(['account/login']);
      }
    }),
    map(([isLoggedIn]) => isLoggedIn)
  );
};
