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

  iniciarSesion(){

    if(!this.email || !this.password){
      this.errorMsg='Completa todos los campos';
      return;
    }

    // ADMIN FIJO
    const admin = {
      name:'Administrador',
      email:'admin@erp.com',
      password:'Admin@123',
      role:'superAdmin',
      permissions:[
        'VIEW_TICKET',
        'CREATE_TICKET',
        'EDIT_TICKET',
        'DELETE_TICKET',
        'VIEW_USERS',
        'EDIT_USERS'
      ]
    };

    // USUARIOS REGISTRADOS
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    let usuarioLogueado = null;

    if(this.email === admin.email && this.password === admin.password){
      usuarioLogueado = admin;
    }else{

      usuarioLogueado = usuarios.find((u:any)=>
        u.email === this.email &&
        u.password === this.password
      );

    }

    if(usuarioLogueado){

      localStorage.setItem('usuarioERP',JSON.stringify(usuarioLogueado));

      this.messageService.add({
        severity:'success',
        summary:'Bienvenido',
        detail:usuarioLogueado.name
      });

      setTimeout(()=>{
        this.router.navigate(['/user/index']);
      },1000);

    }else{
      this.errorMsg='Correo o contraseña incorrectos';
    }

  }

}