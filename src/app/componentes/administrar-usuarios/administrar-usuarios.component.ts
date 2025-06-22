import { Component } from '@angular/core';
import { Usuario } from '../../entidades/usuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-administrar-usuarios',
  imports: [CommonModule],
  templateUrl: './administrar-usuarios.component.html',
  styleUrl: './administrar-usuarios.component.css'
})
export class AdministrarUsuariosComponent {
  usuarios: Usuario[] = [];

  constructor(private router: Router,private usuarioService: UsuarioService) {
    // this.usuarios = this.usuarioService.listaUsuario;
  }

editarUsuario(usuario: Usuario): void {
  this.usuarioService.usuarioParaEditar = { ...usuario };
  this.router.navigate(['/editar-usuario']);
}
// eliminarUsuario(user: Usuario): void {
//   this.usuarioService.eliminarUsuario(user);
//   this.usuarios = this.usuarioService.listaUsuario; // Actualizar la lista
// }

}
