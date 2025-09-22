import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, throwError } from 'rxjs';
import { Logout } from '../store/auth/auth.actions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Xử lý lỗi toàn cục
      console.error('HTTP Error:', error);

      // Xử lý các mã lỗi cụ thể
      switch (error.status) {
        case 401:
          // Token hết hạn hoặc không hợp lệ -> logout
          store.dispatch(new Logout());
          break;
        case 403:
          // Không có quyền truy cập
          console.error('Access forbidden');
          break;
        case 500:
          // Lỗi server
          console.error('Internal server error');
          break;
        case 0:
          // Network error
          console.error('Network error - check internet connection');
          break;
      }

      // Throw lại error để State hoặc Component có thể handle tiếp
      return throwError(() => error);
    })
  );
};
