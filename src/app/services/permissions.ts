import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  getUser() {
    const data = localStorage.getItem('usuarioERP');
    return data ? JSON.parse(data) : null;
  }

  hasPermission(permission:string):boolean{

    const user = this.getUser();

    if(!user) return false;

    if(user.role === 'superAdmin') return true;

    return user.permissions?.includes(permission);

  }

}