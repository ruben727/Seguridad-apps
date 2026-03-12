import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { PermissionsService } from '../../../services/permissions';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    SidebarComponent
  ],
  templateUrl: './users-admin.html'
})
export class UsersAdmin {

  permissions = [
    'VIEW_TICKET',
    'CREATE_TICKET',
    'EDIT_TICKET',
    'DELETE_TICKET',
    'VIEW_USERS',
    'EDIT_USERS'
  ];

  users: any[] = [];

  constructor(private perm: PermissionsService) {

    const data = localStorage.getItem('usersERP');

    if (data) {

      this.users = JSON.parse(data);

    } else {

      this.users = [

        {
          name: 'superAdmin',
          email: 'admin@erp.com',
          role: 'superAdmin',
          permissions: [...this.permissions] // copia completa
        },

        {
          name: 'user1',
          email: 'user@erp.com',
          role: 'user',
          permissions: ['VIEW_TICKET']
        }

      ];

      localStorage.setItem('usersERP', JSON.stringify(this.users));

    }

  }

  togglePermission(user: any, permission: string) {

    if (user.role === 'superAdmin') return;

    const index = user.permissions.indexOf(permission);

    if (index > -1) {

      user.permissions.splice(index, 1);

    } else {

      user.permissions.push(permission);

    }

    localStorage.setItem('usersERP', JSON.stringify(this.users));

  }

}