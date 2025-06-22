import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterModule,CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
   tipoUsuario: number = 0; // 0 = no logueado

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.tipoUsuario = usuario.tipoUsuario || 0;
      } catch (error) {
        console.error('Error al leer usuario desde localStorage:', error);
        this.tipoUsuario = 0;
      }
    }
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.tipoUsuario = 0;
  }
}
