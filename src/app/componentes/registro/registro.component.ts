import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})



export class RegistroComponent {
  usuario = {
    nombre: '',
    apellido: '',
    mail: '',
    fechaNacimiento: '',
    user: '',
    password: '',
    tipoUsuario: 0
  };

  registroForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder,private usuarioService: UsuarioService, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipoUsuario: ['', Validators.required]
    });
  }

  

  guardar(): void {
    if (this.registroForm.valid) {
      const nuevoUsuario = this.registroForm.value;

      this.usuarioService.registrar(nuevoUsuario).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
    }
  }
  }



  

