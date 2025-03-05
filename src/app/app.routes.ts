import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sidemenu',
    loadChildren: () =>
      import('./core/sidemenu/sidemenu.routes').then((m) => m.routes),
  },
  {
    path: '',
    redirectTo: '/sidemenu/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/sidemenu/home',
    pathMatch: 'full',
  },
];

export default routes;
