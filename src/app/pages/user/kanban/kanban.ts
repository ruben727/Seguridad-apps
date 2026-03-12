import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

@Component({
selector:'app-kanban',
standalone:true,
imports:[
CommonModule,
CardModule,
TagModule
],
templateUrl:'./kanban.html'
})
export class Kanban implements OnInit{

tickets:any[]=[]

pending:any[]=[]
progress:any[]=[]
review:any[]=[]
done:any[]=[]

ngOnInit(){

const data=localStorage.getItem('tickets')

if(data){

this.tickets=JSON.parse(data)

this.pending=this.tickets.filter(t=>t.status==='Pendiente')
this.progress=this.tickets.filter(t=>t.status==='Progreso')
this.review=this.tickets.filter(t=>t.status==='Revision')
this.done=this.tickets.filter(t=>t.status==='Hecho')

}

}

}