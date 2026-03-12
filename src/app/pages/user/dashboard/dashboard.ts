import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { Router } from '@angular/router';

import { DividerModule } from 'primeng/divider';

@Component({
selector:'app-dashboard',
standalone:true,
imports:[
CommonModule,
CardModule,
ButtonModule,
TableModule,
TagModule,
DividerModule
],
templateUrl:'./dashboard.html'
})
export class Dashboard implements OnInit{

tickets:any[]=[]

total=0
pending=0
progress=0
done=0
blocked=0

constructor(private router:Router){}

ngOnInit(){

const data=localStorage.getItem('tickets')

if(data){

this.tickets=JSON.parse(data)

this.total=this.tickets.length

this.pending=this.tickets.filter(t=>t.status==='Pendiente').length
this.progress=this.tickets.filter(t=>t.status==='Progreso').length
this.done=this.tickets.filter(t=>t.status==='Hecho').length
this.blocked=this.tickets.filter(t=>t.status==='Bloqueado').length

}

}

createTicket(){

this.router.navigate(['/user/create-ticket'])

}

}