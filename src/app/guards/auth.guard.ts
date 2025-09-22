import { AuthState } from './../store/auth/auth.state';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuth = store.selectSnapshot(AuthState.isAuthenticated);
  return isAuth ? true : router.createUrlTree(['/auth']);
};

