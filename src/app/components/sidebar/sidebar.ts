import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RouterModule } from '@angular/router';
import { PermissionsService } from '../../services/permissions';

@Component({
selector:'app-sidebar',
standalone:true,
imports:[
CommonModule,
PanelModule,
ButtonModule,
DividerModule,
RouterModule
],
templateUrl:'./sidebar.html'
})
export class SidebarComponent{

constructor(public perm:PermissionsService){}

}