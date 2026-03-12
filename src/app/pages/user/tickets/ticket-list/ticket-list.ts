import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { SidebarComponent } from '../../../../components/sidebar/sidebar';

@Component({
selector:'app-ticket-list',
standalone:true,
imports:[
CommonModule,
TableModule, 
SidebarComponent
],
templateUrl:'./ticket-list.html'
})
export class TicketList{

tickets:any[]=[]

}