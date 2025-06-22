import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../entidades/usuario';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-editar-usuario',
  //standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent {

  usuario: Usuario = {
    nombre: '',
    apellido: '',
    mail: '',
    fechaNacimiento: new Date(),
    user: '',
    password: '',
    tipoUsuario: 0
  };

  constructor(private usuarioService: UsuarioService, private router: Router) {
    // if (this.usuarioService.usuarioParaEditar) {
    //   this.usuario = { ...this.usuarioService.usuarioParaEditar };
    // } else {
    //   alert('No hay usuario para editar');
    //   this.router.navigate(['/administrar-usuarios']);
    // }
  }

  guardarCambios() {
    const index = this.usuarioService.listaUsuario.findIndex(u => u.user === this.usuario.user);
    if (index !== -1) {
      this.usuarioService.listaUsuario[index] = this.usuario;
      localStorage.setItem('usuarios', JSON.stringify(this.usuarioService.listaUsuario));
      this.router.navigate(['/administrar-usuarios']);
    }
  }
}
