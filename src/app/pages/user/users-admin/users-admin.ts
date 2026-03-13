import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';  // CAMBIADO: InputSwitchModule → ToggleSwitchModule

import { ConfirmationService, MessageService } from 'primeng/api';

import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { PermissionsService } from '../../../services/permissions';  // Sin .service

interface User {
  name: string;
  email: string;
  role: 'superAdmin' | 'admin' | 'user';
  active: boolean;
  permissions: string[];
  createdAt?: Date;
  lastLogin?: Date;
}

@Component({
  selector: 'app-users-admin',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    CardModule,
    DialogModule,
    ToastModule,
    TagModule,
    InputTextModule,
    SelectModule,
    DividerModule,
    TooltipModule,
    AvatarModule,
    ConfirmDialogModule,
    ToggleSwitchModule,  // CAMBIADO
    SidebarComponent
  ],
  templateUrl: './users-admin.html',
  styleUrls: ['./users-admin.css']
})
export class UsersAdmin implements OnInit {

  // Lista completa de permisos en español
  permissionsList = [
    { key: 'VIEW_TICKET', label: 'Ver Tickets', category: 'Tickets', description: 'Puede ver los tickets existentes' },
    { key: 'CREATE_TICKET', label: 'Crear Tickets', category: 'Tickets', description: 'Puede crear nuevos tickets' },
    { key: 'EDIT_TICKET', label: 'Editar Tickets', category: 'Tickets', description: 'Puede editar cualquier ticket' },
    { key: 'DELETE_TICKET', label: 'Eliminar Tickets', category: 'Tickets', description: 'Puede eliminar tickets' },
    { key: 'CHANGE_STATUS', label: 'Cambiar Estado', category: 'Tickets', description: 'Puede cambiar el estado de los tickets' },
    { key: 'COMMENT_TICKET', label: 'Comentar Tickets', category: 'Tickets', description: 'Puede agregar comentarios' },
    { key: 'ASSIGN_TICKET', label: 'Asignar Tickets', category: 'Tickets', description: 'Puede reasignar tickets a otros usuarios' },
    
    { key: 'VIEW_GROUP', label: 'Ver Grupos', category: 'Grupos', description: 'Puede ver los grupos existentes' },
    { key: 'GROUP_CREATE', label: 'Crear Grupos', category: 'Grupos', description: 'Puede crear nuevos grupos' },
    { key: 'GROUP_EDIT', label: 'Editar Grupos', category: 'Grupos', description: 'Puede editar grupos existentes' },
    { key: 'GROUP_DELETE', label: 'Eliminar Grupos', category: 'Grupos', description: 'Puede eliminar grupos' },
    { key: 'GROUP_ADD_USER', label: 'Añadir Miembros', category: 'Grupos', description: 'Puede añadir usuarios a grupos' },
    { key: 'GROUP_DELETE_USER', label: 'Eliminar Miembros', category: 'Grupos', description: 'Puede eliminar usuarios de grupos' },
    
    { key: 'VIEW_USERS', label: 'Ver Usuarios', category: 'Usuarios', description: 'Puede ver la lista de usuarios' },
    { key: 'EDIT_USERS', label: 'Editar Usuarios', category: 'Usuarios', description: 'Puede editar usuarios y permisos' },
    { key: 'CREATE_USER', label: 'Crear Usuarios', category: 'Usuarios', description: 'Puede crear nuevos usuarios' },
    { key: 'DELETE_USER', label: 'Eliminar Usuarios', category: 'Usuarios', description: 'Puede eliminar usuarios' }
  ];

  // Usuarios
  users: User[] = [];
  
  // Usuario seleccionado para editar permisos
  selectedUser: User | null = null;
  
  // Usuario para edición/creación
  editingUser: User | null = null;
  
  // Diálogos
  showPermissionsDialog: boolean = false;
  showUserDialog: boolean = false;
  
  // Filtros
  searchText: string = '';
  roleFilter: string = '';
  statusFilter: string = '';
  
  // Roles disponibles
  roles = [
    { label: 'Super Admin', value: 'superAdmin' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Usuario', value: 'user' }
  ];
  
  // Categorías de permisos
  permissionCategories = ['Tickets', 'Grupos', 'Usuarios'];
  
  // Usuario actual (superAdmin)
  currentUser: any = null;

  constructor(
    public permissionsService: PermissionsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar usuario actual
    const userData = localStorage.getItem('usuarioERP');
    this.currentUser = userData ? JSON.parse(userData) : null;

    // Cargar usuarios del localStorage
    const usersData = localStorage.getItem('usuarios');
    if (usersData) {
      this.users = JSON.parse(usersData);
      
      // Asegurar que todos tengan active
      this.users.forEach(u => {
        if (u.active === undefined) u.active = true;
        if (!u.permissions) u.permissions = [];
      });
    }

    // Asegurar que superAdmin existe
    const adminExists = this.users.some(u => u.email === 'admin@erp.com');
    if (!adminExists) {
      this.users.unshift({
        name: 'Administrador',
        email: 'admin@erp.com',
        role: 'superAdmin',
        active: true,
        permissions: this.permissionsList.map(p => p.key),
        createdAt: new Date()
      });
      this.saveUsers();
    }
  }

  // Abrir modal de permisos
  openPermissions(user: User) {
    if (user.role === 'superAdmin' && this.currentUser?.email !== 'admin@erp.com') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acción no permitida',
        detail: 'No puedes modificar los permisos del Super Admin'
      });
      return;
    }
    
    this.selectedUser = { ...user };
    this.showPermissionsDialog = true;
  }

  // Cerrar modal de permisos
  closePermissionsModal() {
    this.showPermissionsDialog = false;
    this.selectedUser = null;
  }

  // Alternar permiso
  togglePermission(permissionKey: string) {
    if (!this.selectedUser) return;
    
    if (this.selectedUser.role === 'superAdmin') return;
    
    const index = this.selectedUser.permissions.indexOf(permissionKey);
    
    if (index > -1) {
      this.selectedUser.permissions.splice(index, 1);
    } else {
      this.selectedUser.permissions.push(permissionKey);
    }
  }

  // Verificar si el usuario tiene un permiso específico
  userHasPermission(user: User, permissionKey: string): boolean {
    return user.permissions?.includes(permissionKey) || false;
  }

  // Guardar permisos
  savePermissions() {
    if (!this.selectedUser) return;
    
    // Encontrar usuario original y actualizar
    const index = this.users.findIndex(u => u.email === this.selectedUser!.email);
    if (index !== -1) {
      this.users[index].permissions = [...this.selectedUser.permissions];
      this.saveUsers();
      
      // Si el usuario actual es el que se está editando, actualizar en localStorage
      if (this.currentUser?.email === this.selectedUser.email) {
        const updatedUser = { ...this.users[index] };
        localStorage.setItem('usuarioERP', JSON.stringify(updatedUser));
      }
      
      this.messageService.add({
        severity: 'success',
        summary: 'Permisos actualizados',
        detail: `Permisos de ${this.selectedUser.name} guardados correctamente`
      });
      
      this.closePermissionsModal();
    }
  }

  // Alternar estado activo/inactivo
  toggleActive(user: User) {
    if (user.role === 'superAdmin' && this.currentUser?.email !== 'admin@erp.com') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acción no permitida',
        detail: 'No puedes desactivar al Super Admin'
      });
      return;
    }
    
    user.active = !user.active;
    this.saveUsers();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Estado actualizado',
      detail: `${user.name} ha sido ${user.active ? 'activado' : 'desactivado'}`
    });
  }

  // Abrir modal para nuevo usuario
  openNewUserDialog() {
    this.editingUser = {
      name: '',
      email: '',
      role: 'user',
      active: true,
      permissions: ['VIEW_TICKET'], // Permiso básico por defecto
      createdAt: new Date()
    };
    this.showUserDialog = true;
  }

  // Abrir modal para editar usuario
  openEditUserDialog(user: User) {
    if (user.role === 'superAdmin' && this.currentUser?.email !== 'admin@erp.com') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acción no permitida',
        detail: 'No puedes editar al Super Admin'
      });
      return;
    }
    
    this.editingUser = { ...user };
    this.showUserDialog = true;
  }

  // Cerrar modal de usuario
  closeUserDialog() {
    this.showUserDialog = false;
    this.editingUser = null;
  }

  // Guardar usuario (nuevo o editado)
  saveUser() {
    if (!this.editingUser) return;
    
    // Validaciones
    if (!this.editingUser.name?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El nombre es obligatorio'
      });
      return;
    }
    
    if (!this.editingUser.email?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El email es obligatorio'
      });
      return;
    }
    
    // Verificar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editingUser.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El email no tiene un formato válido'
      });
      return;
    }
    
    // Verificar si el email ya existe (para nuevos usuarios)
    const existingUser = this.users.find(u => u.email === this.editingUser!.email);
    
    if (!existingUser) {
      // Nuevo usuario
      this.users.push({ ...this.editingUser });
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario creado',
        detail: `${this.editingUser.name} ha sido creado correctamente`
      });
    } else {
      // Actualizar usuario existente (solo si no es superAdmin o es el mismo)
      if (existingUser.role === 'superAdmin' && this.currentUser?.email !== 'admin@erp.com') {
        this.messageService.add({
          severity: 'warn',
          summary: 'Acción no permitida',
          detail: 'No puedes modificar al Super Admin'
        });
        this.closeUserDialog();
        return;
      }
      
      const index = this.users.findIndex(u => u.email === this.editingUser!.email);
      if (index !== -1) {
        this.users[index] = { ...this.editingUser };
        this.messageService.add({
          severity: 'success',
          summary: 'Usuario actualizado',
          detail: `${this.editingUser.name} ha sido actualizado`
        });
      }
    }
    
    this.saveUsers();
    this.closeUserDialog();
  }

  // Eliminar usuario
  confirmDeleteUser(user: User) {
    if (user.role === 'superAdmin') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Acción no permitida',
        detail: 'No puedes eliminar al Super Admin'
      });
      return;
    }
    
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al usuario ${user.name}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteUser(user);
      }
    });
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.email !== user.email);
    this.saveUsers();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Usuario eliminado',
      detail: `${user.name} ha sido eliminado`
    });
  }

  // Guardar usuarios en localStorage
  saveUsers() {
    localStorage.setItem('usuarios', JSON.stringify(this.users));
  }

  // Usuarios filtrados para la tabla
  get filteredUsers() {
    return this.users.filter(user => {
      const matchesSearch = !this.searchText || 
        user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchText.toLowerCase());
      
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      
      const matchesStatus = this.statusFilter === '' || 
        (this.statusFilter === 'active' && user.active) ||
        (this.statusFilter === 'inactive' && !user.active);
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  // Obtener severidad para el rol
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

  // Obtener iniciales
  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // Verificar permisos del usuario actual
  hasPermission(permission: string): boolean {
    return this.permissionsService.hasPermission(permission);
  }

// ... (todo el código anterior permanece igual)

  // Obtener etiqueta de permiso
  getPermissionLabel(permissionKey: string): string {
    const perm = this.permissionsList.find(p => p.key === permissionKey);
    return perm ? perm.label : permissionKey;
  }

  // Filtrar permisos por categoría (método para usar en el template)
  getPermissionsByCategory(category: string) {
    return this.permissionsList.filter(p => p.category === category);
  }

  // Verificar si el usuario tiene un permiso específico
 
}
