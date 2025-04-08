import { Routes } from '@angular/router';

import { authGuard } from '../../shared/guards/auth.guard';
import { SidemenuComponent } from './sidemenu.component';

export const routes: Routes = [
  {
    path: '',
    component: SidemenuComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.component').then((m) => m.HomeComponent),
        canActivate: [authGuard],
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites/favorites.component').then(
            (m) => m.FavoritesComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.routes').then((m) => m.routes),
        canActivate: [authGuard],
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
