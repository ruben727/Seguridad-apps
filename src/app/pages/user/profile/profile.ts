import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../../components/sidebar/sidebar';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    CardModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    InputTextModule,
    DatePickerModule,
    MessageModule
  ],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {

  usuario:any = {};

  mensaje = '';

  ngOnInit() {

    const data = localStorage.getItem('usuarioERP');

    if (data) {
      this.usuario = JSON.parse(data);
      this.usuario.fechaNacimiento = new Date(this.usuario.fechaNacimiento);
    }

  }

  guardar() {

    localStorage.setItem('usuarioERP', JSON.stringify(this.usuario));

    this.mensaje = 'Datos actualizados correctamente';
  }

}