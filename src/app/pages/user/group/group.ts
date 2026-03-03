import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    CardModule,
    ButtonModule,
    DividerModule,
    TableModule,
    TagModule
  ],
  templateUrl: './group.html',
})
export class Group {

  groups = [
    {
      id: 1,
      nombre: 'Administradores',
      descripcion: 'Acceso completo al sistema',
      usuarios: 5,
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Ventas',
      descripcion: 'Gestión comercial',
      usuarios: 8,
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Invitados',
      descripcion: 'Acceso limitado',
      usuarios: 12,
      estado: 'Inactivo'
    }
  ];

}