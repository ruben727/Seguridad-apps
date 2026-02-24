import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    PasswordModule,
    MessageModule
  ],
  templateUrl: './login.html',
})
export class Login {

  email = '';
  password = '';
  errorMsg = '';

  // Credenciales hardcodeadas
  private credenciales = {
    email: 'ruben@erp.com',
    password: 'Ruben@12345'
  };

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.email === this.credenciales.email && this.password === this.credenciales.password) {
      this.errorMsg = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMsg = 'Correo o contraseña incorrectos.';
    }
  }
}