import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario, UsuarioService } from '../../servicios/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public usuario:Usuario = {nombre:'',apellido:'',mail:'',fechaNacimiento:new Date(),user:'',password:'',tipoUsuario:0}
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.loginForm = this.fb.group({
      user: [''],
      password: ['']
    });
  }

  login() {
    const credenciales = this.loginForm.value;
    this.usuarioService.login(credenciales).subscribe({
      next: (usuario) => {
        if (usuario) {
          alert('Login exitoso!');
          localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
          this.router.navigate(['/principal']);
        } else {
          alert('Usuario o contraseña incorrectos');
        }
      },
      error: (err) => {
        alert('Error en el login: ' + (err.error.message || 'Error desconocido'));
        console.error(err);
      }
    });
  }
}
