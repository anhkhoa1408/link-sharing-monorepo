import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (module) => module.LoginComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
