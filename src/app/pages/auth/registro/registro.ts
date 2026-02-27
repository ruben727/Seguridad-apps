import { Component } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormBuilder,
  FormGroup
} from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


// 🔹 VALIDADOR MAYOR DE EDAD
export const mayorDeEdadValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value) return null;

  const hoy = new Date();
  const nacimiento = new Date(control.value);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad >= 18 ? null : { menorDeEdad: true };
};


// 🔹 VALIDADOR CONTRASEÑAS IGUALES
export const passwordsIgualesValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const pass = group.get('password')?.value;
  const confirmar = group.get('confirmarPassword')?.value;

  return pass === confirmar ? null : { noCoinciden: true };
};


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    FloatLabelModule,
    PasswordModule,
    DatePickerModule,
    MessageModule,
    DividerModule
  ],
  templateUrl: './registro.html',
})
export class Registro {

  form: FormGroup;
  maxFecha = new Date();
  enviado = false;

  constructor(private fb: FormBuilder, private router: Router) {

    this.form = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      nombreCompleto: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      fechaNacimiento: [null, [Validators.required, mayorDeEdadValidator]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/)
      ]],
      confirmarPassword: ['', Validators.required],
    }, { validators: passwordsIgualesValidator });
  }

  // 🔹 Método para mostrar errores
  error(campo: string, tipo: string) {
    const control = this.form.get(campo);
    return (control?.touched || this.enviado) && control?.hasError(tipo);
  }

  // 🔹 Registrar
  registrar() {

    this.enviado = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('Registro exitoso:', this.form.value);

    // Aquí iría tu servicio HTTP después
    this.router.navigate(['/login']);
  }
}