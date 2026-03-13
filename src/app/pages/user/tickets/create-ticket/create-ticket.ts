import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InputTextModule } from 'primeng/inputtext';  // Este módulo ya incluye pInputTextarea
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

import { MessageService } from 'primeng/api';

import { SidebarComponent } from '../../../../components/sidebar/sidebar';
import { PermissionsService } from '../../../../services/permissions';

interface Group {
  id: string;
  name: string;
  description: string;
  members: any[];
}

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,  // Este módulo es suficiente para inputs y textareas
    SelectModule,
    ButtonModule,
    CardModule,
    ToastModule,
    MessageModule,
    DividerModule,
    RadioButtonModule,
    TooltipModule,
    TagModule,
    SidebarComponent
  ],
  templateUrl: './create-ticket.html',
  styleUrls: ['./create-ticket.css']
})
export class CreateTicket implements OnInit {
  
  // Campos del ticket
  title: string = '';
  description: string = '';
  priority: string = 'Media';
  selectedGroup: Group | null = null;
  assignedUser: any = null;
  status: string = 'Pendiente';
  
  // Opciones para selects
  priorities: any[] = [
    { label: 'Alta', value: 'Alta', severity: 'danger' },
    { label: 'Media', value: 'Media', severity: 'warning' },
    { label: 'Baja', value: 'Baja', severity: 'success' }
  ];
  
  // Listas dinámicas
  groups: Group[] = [];
  availableUsers: any[] = [];
  
  // Flags para validación
  submitted: boolean = false;
  
  // Usuario actual
  currentUser: any = null;

  constructor(
    public perm: PermissionsService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar usuario actual
    const userData = localStorage.getItem('usuarioERP');
    this.currentUser = userData ? JSON.parse(userData) : null;

    // Cargar todos los grupos
    const groupsData = localStorage.getItem('groups');
    if (groupsData) {
      this.groups = JSON.parse(groupsData);
    }

    // Cargar todos los usuarios registrados
    const usersData = localStorage.getItem('usuarios');
    if (usersData) {
      this.availableUsers = JSON.parse(usersData);
      
      // Incluir al admin si no está
      const adminExists = this.availableUsers.some(u => u.email === 'admin@erp.com');
      if (!adminExists) {
        this.availableUsers.unshift({
          name: 'Administrador',
          email: 'admin@erp.com',
          role: 'superAdmin'
        });
      }
    }
  }

  // Cuando se selecciona un grupo, cargar sus miembros
  onGroupChange() {
    this.assignedUser = null; // Resetear usuario asignado
    
    if (this.selectedGroup) {
      // Buscar el grupo completo con sus miembros
      const group = this.groups.find(g => g.id === this.selectedGroup?.id);
      if (group) {
        this.selectedGroup = group;
        this.availableUsers = group.members || [];
      }
    } else {
      // Si no hay grupo seleccionado, mostrar todos los usuarios
      this.loadData();
    }
  }

  // Validar campos obligatorios
  isValid(): boolean {
    return this.title?.trim()?.length > 0 && 
           this.description?.trim()?.length > 0 &&
           this.priority?.length > 0;
  }

  // Crear ticket
  create() {
    this.submitted = true;

    // Verificar permiso
    if (!this.perm.hasPermission('CREATE_TICKET')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permiso denegado',
        detail: 'No tienes permiso para crear tickets'
      });
      return;
    }

    // Validar campos obligatorios
    if (!this.isValid()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Completa todos los campos obligatorios'
      });
      return;
    }

    // Obtener tickets existentes
    let tickets: any[] = [];
    const data = localStorage.getItem('tickets');
    if (data) {
      tickets = JSON.parse(data);
    }

    // Crear nuevo ticket
    const newTicket = {
      id: 'TICKET-' + Date.now(),
      ticketNumber: tickets.length + 1,
      title: this.title.trim(),
      description: this.description.trim(),
      priority: this.priority,
      status: 'Pendiente',
      group: this.selectedGroup ? {
        id: this.selectedGroup.id,
        name: this.selectedGroup.name
      } : null,
      assignedTo: this.assignedUser || null,
      createdBy: this.currentUser,
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días por defecto
      comments: []
    };

    tickets.push(newTicket);
    localStorage.setItem('tickets', JSON.stringify(tickets));

    // Mostrar mensaje de éxito
    this.messageService.add({
      severity: 'success',
      summary: 'Ticket creado',
      detail: `Ticket #${newTicket.ticketNumber} creado correctamente`
    });

    // Limpiar formulario
    this.resetForm();

    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      this.router.navigate(['/user/tickets']);
    }, 1500);
  }

  // Resetear formulario
  resetForm() {
    this.title = '';
    this.description = '';
    this.priority = 'Media';
    this.selectedGroup = null;
    this.assignedUser = null;
    this.submitted = false;
  }

  // Verificar permisos
  hasPermission(permission: string): boolean {
    return this.perm.hasPermission(permission);
  }

  // Obtener severidad para la prioridad
  getPrioritySeverity(priority: string): string {
    const p = this.priorities.find(p => p.value === priority);
    return p?.severity || 'info';
  }
}