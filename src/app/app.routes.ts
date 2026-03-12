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
    path: 'user/dashboard', 
    loadComponent: () => import('./pages/user/dashboard/dashboard').then(m => m.Dashboard) 
  },

   { 
    path: 'user/Admin', 
    loadComponent: () => import('./pages/user/users-admin/users-admin').then(m => m.UsersAdmin) 
  },
 

  { 
    path: 'user/tickets', 
    loadComponent: () => import('./pages/user/tickets/ticket-list/ticket-list').then(m => m.TicketList) 
  },

  { 
    path: 'user/tickets/create', 
    loadComponent: () => import('./pages/user/tickets/create-ticket/create-ticket').then(m => m.CreateTicket) 
  },

  {
    path: '**',
    redirectTo: ''
  }

];