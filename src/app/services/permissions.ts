import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  getUser() {
    const data = localStorage.getItem('usuarioERP');
    return data ? JSON.parse(data) : null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    
    if (!user) return false;
    
    // SuperAdmin tiene todos los permisos
    if (user.role === 'superAdmin') return true;
    
    return user.permissions?.includes(permission);
  }

  // Método helper para verificar múltiples permisos
  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getUser();
    
    if (!user) return false;
    if (user.role === 'superAdmin') return true;
    
    return permissions.some(p => user.permissions?.includes(p));
  }

  // Método helper para verificar todos los permisos
  hasAllPermissions(permissions: string[]): boolean {
    const user = this.getUser();
    
    if (!user) return false;
    if (user.role === 'superAdmin') return true;
    
    return permissions.every(p => user.permissions?.includes(p));
  }
}