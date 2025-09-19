import { Routes } from '@angular/router';

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
    path: 'animals',
    loadComponent: () =>
      import('./features/animals/animals.component').then(
        (m) => m.AnimalsComponent
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
  { path: '**', redirectTo: 'counter' },
];
