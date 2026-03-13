import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TooltipModule } from 'primeng/tooltip';
import { SelectModule } from 'primeng/select';  // Cambiado de DropdownModule a SelectModule
import { InputTextModule } from 'primeng/inputtext';  // Este módulo ya incluye textarea
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';

import { ConfirmationService, MessageService } from 'primeng/api';

import { SidebarComponent } from '../../../../components/sidebar/sidebar';
import { PermissionsService } from '../../../../services/permissions'; // Ajusta esta ruta

interface Ticket {
  id: string;
  ticketNumber: number;
  title: string;
  description: string;
  status: 'Pendiente' | 'En progreso' | 'Revisión' | 'Hecho';
  priority: 'Alta' | 'Media' | 'Baja';
  assignedTo: any;
  createdBy: any;
  createdAt: Date;
  dueDate: Date;
  group: any;
  comments: Comment[];
  history: HistoryEntry[];
}

interface Comment {
  id: string;
  user: any;
  text: string;
  createdAt: Date;
}

interface HistoryEntry {
  id: string;
  user: any;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  providers: [ConfirmationService, MessageService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TableModule,
    CardModule,
    ButtonModule,
    TagModule,
    AvatarModule,
    AvatarGroupModule,
    TooltipModule,
    SelectModule,  // Cambiado de DropdownModule
    InputTextModule,  // Este módulo es suficiente
    SelectButtonModule,
    ToastModule,
    DialogModule,
    DividerModule,
    ConfirmDialogModule,
    MenuModule,
    SidebarComponent
  ],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css']
})
export class TicketList implements OnInit {
  
  // Tickets
  allTickets: Ticket[] = [];
  
  // Tickets filtrados por columnas Kanban
  pendientes: Ticket[] = [];
  enProgreso: Ticket[] = [];
  revision: Ticket[] = [];
  hecho: Ticket[] = [];
  
  // Vista actual (kanban o tabla)
  viewMode: 'kanban' | 'table' = 'kanban';
  viewOptions = [
    { label: 'Kanban', value: 'kanban', icon: 'pi pi-th-large' },
    { label: 'Tabla', value: 'table', icon: 'pi pi-list' }
  ];
  
  // Usuario actual
  currentUser: any = null;
  
  // Ticket seleccionado para editar/ver
  selectedTicket: Ticket | null = null;
  showDetailDialog: boolean = false;
  
  // Para drag & drop
  draggedTicket: Ticket | null = null;
  
  // Para filtros en tabla
  globalFilter: string = '';
  statusFilter: string = '';
  priorityFilter: string = '';
  
  // Prioridades para filtros
  priorities = ['Alta', 'Media', 'Baja'];
  statuses = ['Pendiente', 'En progreso', 'Revisión', 'Hecho'];

  constructor(
    public permissionsService: PermissionsService,  // Cambiado el nombre para evitar confusión
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Cargar usuario actual
    const userData = localStorage.getItem('usuarioERP');
    this.currentUser = userData ? JSON.parse(userData) : null;

    // Cargar tickets
    const ticketsData = localStorage.getItem('tickets');
    if (ticketsData) {
      this.allTickets = JSON.parse(ticketsData);
      this.filterTicketsByUser();
    }
  }

  // Filtrar tickets según permisos del usuario
  filterTicketsByUser() {
    // SuperAdmin ve todos
    if (this.currentUser?.role === 'superAdmin') {
      this.updateKanbanColumns(this.allTickets);
      return;
    }

    // Usuarios normales solo ven sus tickets asignados o creados por ellos
    const userTickets = this.allTickets.filter(ticket => 
      ticket.assignedTo?.email === this.currentUser?.email ||
      ticket.createdBy?.email === this.currentUser?.email
    );
    
    this.updateKanbanColumns(userTickets);
  }

  // Actualizar columnas Kanban
  updateKanbanColumns(tickets: Ticket[]) {
    this.pendientes = tickets.filter(t => t.status === 'Pendiente');
    this.enProgreso = tickets.filter(t => t.status === 'En progreso');
    this.revision = tickets.filter(t => t.status === 'Revisión');
    this.hecho = tickets.filter(t => t.status === 'Hecho');
  }

  // Drag & Drop
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drag(ticket: Ticket) {
    this.draggedTicket = ticket;
  }

  drop(status: 'Pendiente' | 'En progreso' | 'Revisión' | 'Hecho') {
    if (this.draggedTicket) {
      
      // Verificar permiso para cambiar estado
      if (!this.canEditTicket(this.draggedTicket)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Permiso denegado',
          detail: 'No tienes permiso para cambiar el estado de este ticket'
        });
        this.draggedTicket = null;
        return;
      }

      // Registrar en historial
      const oldStatus = this.draggedTicket.status;
      
      // Actualizar estado
      this.draggedTicket.status = status;
      
      // Añadir entrada al historial
      this.addHistoryEntry(
        this.draggedTicket,
        'Cambio de estado',
        'status',
        oldStatus,
        status
      );
      
      // Guardar cambios
      this.saveTickets();
      
      // Actualizar columnas
      this.filterTicketsByUser();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Estado actualizado',
        detail: `Ticket movido a ${status}`
      });
      
      this.draggedTicket = null;
    }
  }

  // Abrir detalle del ticket
  viewTicket(ticket: Ticket) {
    this.selectedTicket = { ...ticket };
    this.showDetailDialog = true;
  }

  // Cerrar detalle
  closeDetail() {
    this.showDetailDialog = false;
    this.selectedTicket = null;
  }

  // Guardar cambios desde detalle
  saveTicketFromDetail() {
    if (!this.selectedTicket) return;

    // Verificar permisos de edición
    if (!this.canEditTicket(this.selectedTicket)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permiso denegado',
        detail: 'No tienes permiso para editar este ticket'
      });
      return;
    }

    // Encontrar el ticket original y actualizar
    const index = this.allTickets.findIndex(t => t.id === this.selectedTicket!.id);
    if (index !== -1) {
      
      // Registrar cambios (simplificado - en producción comparar campos)
      this.addHistoryEntry(
        this.selectedTicket,
        'Actualización de ticket',
        'ticket',
        'anterior',
        'nuevo'
      );
      
      this.allTickets[index] = { ...this.selectedTicket };
      this.saveTickets();
      this.filterTicketsByUser();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Ticket actualizado',
        detail: 'Los cambios han sido guardados'
      });
      
      this.closeDetail();
    }
  }

  // Agregar comentario
  addComment(ticket: Ticket, commentText: string) {
    if (!commentText?.trim()) return;

    const newComment: Comment = {
      id: 'comment-' + Date.now(),
      user: this.currentUser,
      text: commentText.trim(),
      createdAt: new Date()
    };

    if (!ticket.comments) {
      ticket.comments = [];
    }
    
    ticket.comments.push(newComment);
    
    this.addHistoryEntry(
      ticket,
      'Comentario agregado',
      'comments',
      '',
      commentText
    );
    
    this.saveTickets();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Comentario agregado',
      detail: 'El comentario ha sido guardado'
    });
  }

  // Agregar entrada al historial
  addHistoryEntry(ticket: Ticket, action: string, field: string, oldValue: string, newValue: string) {
    if (!ticket.history) {
      ticket.history = [];
    }
    
    ticket.history.push({
      id: 'history-' + Date.now(),
      user: this.currentUser,
      action: action,
      field: field,
      oldValue: oldValue,
      newValue: newValue,
      timestamp: new Date()
    });
  }

  // Verificar si puede editar el ticket
  canEditTicket(ticket: Ticket): boolean {
    // SuperAdmin puede editar todo
    if (this.currentUser?.role === 'superAdmin') return true;
    
    // Usuario con permiso EDIT_TICKET puede editar
    if (this.permissionsService.hasPermission('EDIT_TICKET')) return true;
    
    // El usuario asignado puede editar
    if (ticket.assignedTo?.email === this.currentUser?.email) return true;
    
    // El creador puede editar
    if (ticket.createdBy?.email === this.currentUser?.email) return true;
    
    return false;
  }

  // Verificar si puede comentar
  canComment(ticket: Ticket): boolean {
    // SuperAdmin puede comentar
    if (this.currentUser?.role === 'superAdmin') return true;
    
    // Usuario con permiso puede comentar
    if (this.permissionsService.hasPermission('COMMENT_TICKET')) return true;
    
    // El usuario asignado puede comentar
    if (ticket.assignedTo?.email === this.currentUser?.email) return true;
    
    return false;
  }

  // Verificar si puede cambiar estado
  canChangeStatus(ticket: Ticket): boolean {
    // SuperAdmin puede cambiar
    if (this.currentUser?.role === 'superAdmin') return true;
    
    // Usuario con permiso puede cambiar
    if (this.permissionsService.hasPermission('CHANGE_STATUS')) return true;
    
    // El usuario asignado puede cambiar
    if (ticket.assignedTo?.email === this.currentUser?.email) return true;
    
    return false;
  }

  // Eliminar ticket
  confirmDelete(ticket: Ticket) {
    if (!this.permissionsService.hasPermission('DELETE_TICKET')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Permiso denegado',
        detail: 'No tienes permiso para eliminar tickets'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el ticket "${ticket.title}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.deleteTicket(ticket);
      }
    });
  }

  deleteTicket(ticket: Ticket) {
    this.allTickets = this.allTickets.filter(t => t.id !== ticket.id);
    this.saveTickets();
    this.filterTicketsByUser();
    
    this.messageService.add({
      severity: 'success',
      summary: 'Ticket eliminado',
      detail: `Ticket "${ticket.title}" eliminado`
    });
  }

  // Guardar tickets en localStorage
  saveTickets() {
    localStorage.setItem('tickets', JSON.stringify(this.allTickets));
  }

  // Obtener severidad para prioridad
  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (priority) {
      case 'Alta':
        return 'danger';
      case 'Media':
        return 'warn';
      case 'Baja':
        return 'success';
      default:
        return 'info';
    }
  }

  // Obtener severidad para estado
  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'Hecho':
        return 'success';
      case 'En progreso':
        return 'info';
      case 'Revisión':
        return 'warn';
      case 'Pendiente':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  // Formatear fecha
  formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Verificar permisos generales
  hasPermission(permission: string): boolean {
    return this.permissionsService.hasPermission(permission);
  }
}