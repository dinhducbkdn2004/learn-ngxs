import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AnimalsState } from './store/animals/animals.state';
import { CounterState } from './store/counter/counter.state';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { TodoState } from './store/todo/todo.state';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { UsersState } from './store/users/users.state';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(
      [AnimalsState, CounterState, TodoState, UsersState],
      withNgxsReduxDevtoolsPlugin(),
      withNgxsLoggerPlugin()
    ),
  ],
};
