import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    CardModule
  ],
  templateUrl: './group.html',
})
export class Group{}