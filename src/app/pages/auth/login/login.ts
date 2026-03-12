import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    PasswordModule,
    MessageModule,
    ToastModule
  ],
  templateUrl: './login.html',
})
export class Login {

  email = '';
  password = '';
  errorMsg = '';

  private credenciales = {
    usuario: 'ruben',
    email: 'ruben@erp.com',
    password: 'Ruben@12345',
    nombre: 'Rubén Mendoza',
    direccion: 'Querétaro, México',
    telefono: '4421234567',
    fechaNacimiento: '2000-05-10'
  };

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  iniciarSesion() {

    if (!this.email || !this.password) {
      this.errorMsg = 'Debes completar todos los campos.';
      return;
    }

    if (this.email === this.credenciales.email &&
        this.password === this.credenciales.password) {

      this.errorMsg = '';

      localStorage.setItem('usuarioERP', JSON.stringify(this.credenciales));

      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenido',
        detail: 'Inicio de sesión correcto'
      });

      setTimeout(() => {
        this.router.navigate(['/user/index']);
      }, 1500);

    } else {
      this.errorMsg = 'Correo o contraseña incorrectos.';
    }
  }
}