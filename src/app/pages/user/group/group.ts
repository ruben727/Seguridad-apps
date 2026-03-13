import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';  // Este módulo ya incluye pInputTextarea
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';

import { ConfirmationService, MessageService } from 'primeng/api';

import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { PermissionsService } from '../../../services/permissions';

interface GroupData {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
  members: any[];
  memberCount?: number;
}

@Component({
  selector: 'app-group',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,  // Este módulo es suficiente para inputs y textareas
    ToastModule,
    MessageModule,
    DividerModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule,
    TooltipModule,
    AvatarModule,
    AvatarGroupModule,
    MenuModule,
    PanelModule,
    SidebarComponent
  ],
  templateUrl: './group.html',
  styleUrls: ['./group.css']
})
export class Group implements OnInit {
  
  // Variables para grupos
  groups: GroupData[] = [];
  selectedGroup: GroupData | null = null;
  
  // Variables para el grupo actual en edición
  groupName: string = '';
  groupDescription: string = '';
  
  // Variables para añadir usuarios
  emailToAdd: string = '';
  
  // Listas de usuarios
  allUsers: any[] = [];
  groupMembers: any[] = [];
  availableUsers: any[] = [];
  
  // Variables para diálogos
  showCreateDialog: boolean = false;
  showEditDialog: boolean = false;
  showMembersDialog: boolean = false;
  showDeleteDialog: boolean = false;
  showViewDialog: boolean = false;
  
  // Usuario actual
  currentUser: any = null;
  
  selectedMemberToRemove: any = null;
  groupToDelete: GroupData | null = null;

  constructor(
    public perm: PermissionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  // Propiedad computada para total de miembros
  get totalMembers(): number {
    return this.groups.reduce((acc, g) => acc + (g.memberCount || 0), 0);
  }

  loadData() {
    // Cargar usuario actual
    const userData = localStorage.getItem('usuarioERP');
    this.currentUser = userData ? JSON.parse(userData) : null;

    // Cargar todos los usuarios registrados
    const usersData = localStorage.getItem('usuarios');
    this.allUsers = usersData ? JSON.parse(usersData) : [];

    // Incluir al admin en la lista de usuarios disponibles si no está
    const adminExists = this.allUsers.some(u => u.email === 'admin@erp.com');
    if (!adminExists && this.currentUser?.email === 'admin@erp.com') {
      this.allUsers.unshift({
        name: 'Administrador',
        email: 'admin@erp.com',
        role: 'superAdmin',
        permissions: ['*']
      });
    }

    // Cargar todos los grupos
    this.loadGroups();
  }

  loadGroups() {
    const groupsData = localStorage.getItem('groups');
    
    if (groupsData) {
      // Si ya existen grupos guardados
      this.groups = JSON.parse(groupsData);
      
      // Calcular memberCount para cada grupo
      this.groups.forEach(group => {
        group.memberCount = group.members?.length || 0;
      });
    } else if (this.perm.hasPermission('VIEW_GROUP') && this.currentUser) {
      // Si no hay grupos pero tiene permiso, crear grupo por defecto
      this.createDefaultGroup();
    }
  }

  createDefaultGroup() {
    if (!this.currentUser) return;
    
    const defaultGroup: GroupData = {
      id: 'default-group-' + Date.now(),
      name: 'Mi Grupo',
      description: 'Grupo principal de trabajo',
      createdAt: new Date(),
      createdBy: this.currentUser?.email || 'system',
      members: this.currentUser ? [this.currentUser] : [],
      memberCount: 1
    };
    
    this.groups = [defaultGroup];
    this.selectedGroup = defaultGroup;
    this.loadGroupMembers(defaultGroup);
    this.saveGroups();
  }

  loadGroupMembers(group: GroupData) {
    this.selectedGroup = group;
    this.groupName = group.name;
    this.groupDescription = group.description || '';
    this.groupMembers = group.members || [];
    this.updateAvailableUsers();
  }

  updateAvailableUsers() {
    // Filtrar usuarios que ya están en el grupo seleccionado
    this.availableUsers = this.allUsers.filter(user => 
      !this.groupMembers.some(member => member.email === user.email)
    );
  }

  // Crear nuevo grupo
  createGroup() {
    if (!this.groupName.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del grupo es obligatorio'
      });
      return;
    }

    const newGroup: GroupData = {
      id: 'group-' + Date.now(),
      name: this.groupName,
      description: this.groupDescription,
      createdAt: new Date(),
      createdBy: this.currentUser?.email || 'system',
      members: this.currentUser ? [this.currentUser] : [],
      memberCount: this.currentUser ? 1 : 0
    };

    this.groups.push(newGroup);
    this.saveGroups();
    
    // Seleccionar el nuevo grupo
    this.selectedGroup = newGroup;
    this.loadGroupMembers(newGroup);
    
    this.showCreateDialog = false;
    this.groupName = '';
    this.groupDescription = '';
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Grupo creado correctamente'
    });
  }

  // Guardar cambios del grupo seleccionado
  saveGroup() {
    if (!this.selectedGroup) return;
    
    if (!this.groupName.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre del grupo es obligatorio'
      });
      return;
    }

    // Actualizar el grupo en el array
    const index = this.groups.findIndex(g => g.id === this.selectedGroup!.id);
    if (index !== -1) {
      this.groups[index].name = this.groupName;
      this.groups[index].description = this.groupDescription;
      this.groups[index].members = this.groupMembers;
      this.groups[index].memberCount = this.groupMembers.length;
      
      this.selectedGroup = this.groups[index];
      this.saveGroups();
    }
    
    this.showEditDialog = false;
    
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Grupo actualizado correctamente'
    });
  }

  // Añadir usuario al grupo seleccionado
  addUser() {
    if (!this.perm.hasPermission('GROUP_ADD_USER')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permiso denegado',
        detail: 'No tienes permiso para añadir usuarios'
      });
      return;
    }

    if (!this.selectedGroup) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Selecciona un grupo primero'
      });
      return;
    }

    if (!this.emailToAdd || !this.emailToAdd.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ingresa un correo electrónico'
      });
      return;
    }

    const email = this.emailToAdd.trim().toLowerCase();
    
    // Buscar usuario en todos los usuarios registrados
    const userToAdd = this.allUsers.find(u => u.email.toLowerCase() === email);
    
    if (!userToAdd) {
      this.messageService.add({
        severity: 'error',
        summary: 'Usuario no encontrado',
        detail: 'No existe un usuario con ese correo electrónico'
      });
      return;
    }

    // Verificar si ya está en el grupo
    const alreadyInGroup = this.groupMembers.some(m => m.email.toLowerCase() === email);
    
    if (alreadyInGroup) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Usuario existente',
        detail: 'El usuario ya pertenece al grupo'
      });
      this.emailToAdd = '';
      return;
    }

    // Añadir usuario al grupo
    this.groupMembers.push(userToAdd);
    
    // Actualizar el grupo en el array
    const index = this.groups.findIndex(g => g.id === this.selectedGroup!.id);
    if (index !== -1) {
      this.groups[index].members = this.groupMembers;
      this.groups[index].memberCount = this.groupMembers.length;
      this.selectedGroup = this.groups[index];
      this.saveGroups();
    }
    
    this.updateAvailableUsers();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Usuario añadido',
      detail: `${userToAdd.name} ha sido añadido al grupo`
    });
    
    this.emailToAdd = '';
  }

  // Confirmar eliminación de usuario
  confirmRemoveUser(user: any) {
    this.selectedMemberToRemove = user;
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${user.name} del grupo?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.removeUser(user);
      }
    });
  }

  // Eliminar usuario del grupo seleccionado
  removeUser(user: any) {
    if (!this.perm.hasPermission('GROUP_DELETE_USER')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permiso denegado',
        detail: 'No tienes permiso para eliminar usuarios'
      });
      return;
    }

    if (!this.selectedGroup) return;

    // No permitir eliminar al último administrador
    if (user.role === 'superAdmin' && this.groupMembers.filter(m => m.role === 'superAdmin').length === 1) {
      this.messageService.add({
        severity: 'error',
        summary: 'Acción no permitida',
        detail: 'No puedes eliminar al último administrador del grupo'
      });
      return;
    }

    this.groupMembers = this.groupMembers.filter(m => m.email !== user.email);
    
    // Actualizar el grupo en el array
    const index = this.groups.findIndex(g => g.id === this.selectedGroup!.id);
    if (index !== -1) {
      this.groups[index].members = this.groupMembers;
      this.groups[index].memberCount = this.groupMembers.length;
      this.selectedGroup = this.groups[index];
      this.saveGroups();
    }
    
    this.updateAvailableUsers();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Usuario eliminado',
      detail: `${user.name} ha sido eliminado del grupo`
    });
  }

  // Seleccionar un grupo para ver detalles
  selectGroup(group: GroupData) {
    this.selectedGroup = group;
    this.loadGroupMembers(group);
  }

  // Preparar edición de grupo
  editGroup(group: GroupData) {
    this.selectedGroup = group;
    this.groupName = group.name;
    this.groupDescription = group.description || '';
    this.groupMembers = group.members || [];
    this.showEditDialog = true;
  }

  // Confirmar eliminación de grupo
  confirmDeleteGroup(group: GroupData) {
    this.groupToDelete = group;
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el grupo "${group.name}"? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteGroup(group);
      }
    });
  }

  // Eliminar grupo
  deleteGroup(group: GroupData) {
    if (!this.perm.hasPermission('GROUP_DELETE')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permiso denegado',
        detail: 'No tienes permiso para eliminar grupos'
      });
      return;
    }

    this.groups = this.groups.filter(g => g.id !== group.id);
    this.saveGroups();
    
    if (this.selectedGroup?.id === group.id) {
      this.selectedGroup = this.groups.length > 0 ? this.groups[0] : null;
      if (this.selectedGroup) {
        this.loadGroupMembers(this.selectedGroup);
      } else {
        this.groupMembers = [];
      }
    }
    
    this.messageService.add({
      severity: 'success',
      summary: 'Grupo eliminado',
      detail: `El grupo "${group.name}" ha sido eliminado`
    });
  }

  // Guardar todos los grupos en localStorage
  saveGroups() {
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }

  // Verificar permisos
  hasPermission(permission: string): boolean {
    return this.perm.hasPermission(permission);
  }

  // Obtener severidad para el tag de rol
  getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (role) {
      case 'superAdmin':
        return 'danger';
      case 'admin':
        return 'warn';
      default:
        return 'info';
    }
  }

  // Formatear fecha
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Obtener iniciales para el avatar
  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}