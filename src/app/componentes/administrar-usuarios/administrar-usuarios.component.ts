import { Component } from '@angular/core';
import { UsuarioServiceService } from '../../servicios/usuario-service.service';
import { Usuario } from '../../entidades/usuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrar-usuarios',
  imports: [CommonModule],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})
export class AdministrarUsuariosComponent {
  usuarios: Usuario[] = [];

  constructor(private router: Router,private usuarioService: UsuarioServiceService) {
    this.usuarios = this.usuarioService.listaUsuario;
  }

editarUsuario(usuario: Usuario): void {
  this.usuarioService.usuarioParaEditar = { ...usuario };
  this.router.navigate(['/editar-usuario']);
}
eliminarUsuario(user: string): void {
  this.usuarioService.eliminarUsuario(user);
  this.usuarios = this.usuarioService.listaUsuario; // Actualizar la lista
}

}
