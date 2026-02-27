import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { SidebarComponent } from '../../../components/sidebar/sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    CardModule
  ],
  templateUrl: './profile.html',
})
export class Profile {}