import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../../entidades/usuario';


@Component({
  selector: 'app-registro',
  imports: [FormsModule,RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
public usuario: Usuario = {nombre: '', apellido: '', mail: '', fechaNacimiento: new Date(), user:'', password: '', tipoUsuario:0};

guardar() {
  // Convertir los datos a JSON y guardarlos en localStorage
  localStorage.setItem('usuario', JSON.stringify(this.usuario));
  console.log('Datos guardados en localStorage:', this.usuario);

}
}