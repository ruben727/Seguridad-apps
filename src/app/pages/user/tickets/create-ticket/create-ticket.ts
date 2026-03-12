import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SidebarComponent } from '../../../../components/sidebar/sidebar';

@Component({
selector:'app-create-ticket',
standalone:true,
imports:[
CommonModule,
FormsModule,
InputTextModule,
SelectModule,
ButtonModule,
CardModule,
SidebarComponent
],
templateUrl:'./create-ticket.html'
})
export class CreateTicket{

title=''
description=''
priority=''

priorities=[
'Alta',
'Media',
'Baja'
]

create(){

const data=localStorage.getItem('tickets')

let tickets:any[]=[]

if(data){

tickets=JSON.parse(data)

}

const newTicket={

id:Date.now(),
title:this.title,
description:this.description,
priority:this.priority,
status:'Pendiente'

}

tickets.push(newTicket)

localStorage.setItem('tickets',JSON.stringify(tickets))

alert('Ticket creado')

}

}