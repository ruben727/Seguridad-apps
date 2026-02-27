import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/landing/landing').then(m => m.Landing) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login) 
  },
  { 
    path: 'registro', 
    loadComponent: () => import('./pages/auth/registro/registro').then(m => m.Registro) 
  },
   { 
    path: 'user/index', 
    loadComponent: () => import('./pages/user/index/index').then(m => m.Index) 
  },
     { 
    path: 'user/profile', 
    loadComponent: () => import('./pages/user/profile/profile').then(m => m.Profile) 
  },
     { 
    path: 'user/group', 
    loadComponent: () => import('./pages/user/group/group').then(m => m.Group) 
  },
  {
    path: '**',
    redirectTo: ''
  }
];