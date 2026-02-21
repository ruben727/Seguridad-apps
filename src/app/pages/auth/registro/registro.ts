import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-registro',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    PasswordModule
  ],
  templateUrl: './registro.html',
})
export class Registro {
  nombre = '';
  email = '';
  password = '';
  confirmarPassword = '';

  registrar() {
    console.log('Nombre:', this.nombre);
    console.log('Email:', this.email);
    console.log('Password:', this.password);
  }
}