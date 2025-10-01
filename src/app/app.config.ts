import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { CounterState } from './store/counter/data-access/counter.state';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { TodoState } from './store/todo/todo.state';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { UsersState } from './store/users/data-access/users.state';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { AuthState } from './store/auth/auth.state';
import { CartState } from './store/cart/cart.state';
import { ProductState } from './store/product/product.state';
import { PostState } from './store/post/post.state';
import { authInterceptor } from './interceptors/http.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      preventDuplicates: true,
      progressBar: true,
    }),
    provideStore(
      [
        CounterState,
        TodoState,
        UsersState,
        AuthState,
        CartState,
        ProductState,
        PostState,
      ],
      withNgxsReduxDevtoolsPlugin(),
      withNgxsLoggerPlugin(),
      withNgxsFormPlugin()
    ),
    withNgxsStoragePlugin({
      keys: ['auth', 'cart', 'todo', 'counter', 'post'],
    }),
  ],
};
