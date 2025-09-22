import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'counter', pathMatch: 'full' },
  {
    path: 'counter',
    loadComponent: () =>
      import('./features/counter/counter.component').then(
        (m) => m.CounterComponent
      ),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./features/todos/todos.component').then((m) => m.TodosComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./features/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: 'posts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/postform/postform.component').then(
        (m) => m.PostformComponent
      ),
  },
  { path: '**', redirectTo: 'counter' },
];
