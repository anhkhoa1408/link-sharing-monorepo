import { Route } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (module) => module.LoginComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (module) => module.RegisterComponent,
      ),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then(
        (module) => module.HomeComponent,
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (module) => module.ProfileComponent,
      ),
  },
  {
    path: 'preview',
    canActivate: [authGuard],
    data: { ownerPreview: true },
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then(
        (module) => module.ProfilePageComponent,
      ),
  },
  {
    path: 'share/:userId',
    data: { ownerPreview: false },
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then(
        (module) => module.ProfilePageComponent,
      ),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
];
