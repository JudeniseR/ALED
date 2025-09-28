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
   tipoUsuario: number = 0; // no logueado
  public usuarioGuardado = localStorage.getItem('usuarioLogueado');


  constructor(){
    console.log(this.usuarioGuardado);
    if (this.usuarioGuardado) {
      try {
        const usuario = JSON.parse(this.usuarioGuardado);
        this.tipoUsuario = Number(usuario.tipoUsuario) || 0;
      } catch (error) {
        console.error('Error al leer usuario desde localStorage:', error);
        this.tipoUsuario = 0;
      }
    }
}
  

  logout(): void {
    localStorage.removeItem('usuarioLogueado');
    this.tipoUsuario = 0;
  }
}
