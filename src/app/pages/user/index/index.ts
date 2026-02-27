import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-index',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    CardModule
  ],
  templateUrl: './index.html',
})
export class Index{}