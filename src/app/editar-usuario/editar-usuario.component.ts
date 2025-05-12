import { Component } from '@angular/core';
import { UsuarioServiceService } from '../servicios/usuario-service.service';
import { Usuario } from '../entidades/usuario';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-usuario',
  imports: [FormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.css'
})
export class EditarUsuarioComponent {
 usuario: Usuario =
 {
    nombre: '',
    apellido: '',
    mail: '',
    fechaNacimiento: new Date(),
    user: '',
    password: '',
    tipoUsuario: 0
  };

  constructor(private usuarioService: UsuarioServiceService, private router: Router) {
    // Copia del usuario para edición
    this.usuario = { ...usuarioService.usuarioParaEditar! };
  }

  guardarCambios() {
    // Buscar y reemplazar en la lista
    const index = this.usuarioService.listaUsuario.findIndex(u => u.user === this.usuario.user);
    if (index !== -1) {
      this.usuarioService.listaUsuario[index] = this.usuario;
    }

    // Guardar en localStorage (opcional)
    localStorage.setItem('usuarios', JSON.stringify(this.usuarioService.listaUsuario));

    this.router.navigate(['/administrar-usuarios']);
  }

}
