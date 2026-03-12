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

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  iniciarSesion() {

    if (!this.email || !this.password) {
      this.errorMsg = 'Debes completar todos los campos.';
      return;
    }

    // OBTENER USUARIOS
    let users = JSON.parse(localStorage.getItem('usersERP') || '[]');

    // SI NO EXISTEN USUARIOS LOS CREA
    if (users.length === 0) {

      users = [

        {
          name: 'superAdmin',
          email: 'admin@erp.com',
          password: 'Admin@123',
          role: 'superAdmin',
          permissions: [
            'VIEW_TICKET',
            'CREATE_TICKET',
            'EDIT_TICKET',
            'DELETE_TICKET',
            'VIEW_USERS',
            'EDIT_USERS'
          ]
        },

        {
          name: 'user1',
          email: 'user@erp.com',
          password: 'User@123',
          role: 'user',
          permissions: ['VIEW_TICKET']
        }

      ];

      localStorage.setItem('usersERP', JSON.stringify(users));
    }

    const usuario = users.find((u: any) =>
      u.email === this.email &&
      u.password === this.password
    );

    if (usuario) {

      localStorage.setItem('usuarioERP', JSON.stringify(usuario));

      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenido',
        detail: usuario.name
      });

      setTimeout(() => {
        this.router.navigate(['/user/index']);
      }, 1000);

    } else {

      this.errorMsg = 'Correo o contraseña incorrectos';

    }

  }

}