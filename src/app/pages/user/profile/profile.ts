import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../components/sidebar/sidebar';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    CardModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule
  ],
  templateUrl: './profile.html',
})
export class Profile {}