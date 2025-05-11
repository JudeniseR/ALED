import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

public usuarioLogueado: Usuario = {nombre: '', apellido: '', mail: '', fechaNacimiento: new Date(), user:'', password: '', tipoUsuario:0};

public listaUsuario: Usuario[] = [];

  constructor() { }
}
