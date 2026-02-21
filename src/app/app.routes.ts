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
    path: '**',
    redirectTo: ''
  }
];