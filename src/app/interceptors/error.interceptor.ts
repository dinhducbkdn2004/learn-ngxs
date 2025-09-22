import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, throwError } from 'rxjs';
import { Logout } from '../store/auth/auth.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      switch (error.status) {
        case 401:
          store.dispatch(new Logout());
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 500:
          console.error('Internal server error');
          break;
        case 0:
          console.error('Network error - check internet connection');
          break;
      }

      return throwError(() => error);
    })
  );
};
