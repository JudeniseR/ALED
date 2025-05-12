import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Usuario } from '../../entidades/usuario';
import { UsuarioServiceService } from '../../servicios/usuario-service.service';


@Component({
  selector: 'app-registro',
  imports: [FormsModule,RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
public usuario: Usuario = {nombre: '', apellido: '', mail: '', fechaNacimiento: new Date(), user:'', password: '', tipoUsuario:0};
 
  constructor(public router:Router,private usuarioService: UsuarioServiceService) {
    
  }

guardar() {
  // Guardar en la lista del servicio
  this.usuarioService.listaUsuario.push({ ...this.usuario });

  // También guardamos en localStorage (opcional)
  localStorage.setItem('usuario', JSON.stringify(this.usuario));
  localStorage.setItem('usuarios', JSON.stringify(this.usuarioService.listaUsuario));

  console.log('Datos guardados en localStorage y servicio:', this.usuario);

  // Redirigir
  this.router.navigateByUrl('/principal');
}

}