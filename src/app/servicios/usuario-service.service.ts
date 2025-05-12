import { Injectable } from '@angular/core';
import { Usuario } from '../entidades/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

public usuarioLogueado: Usuario = {nombre: '', apellido: '', mail: '', fechaNacimiento: new Date(), user:'', password: '', tipoUsuario:0};

public listaUsuario: Usuario[] = [
    {
      nombre: 'Julieta',
      apellido: 'Rojas',
      mail: 'julieta@example.com',
      fechaNacimiento: new Date('1990-05-10'),
      user: 'julieta90',
      password: '1234',
      tipoUsuario: 1
    },
    {
      nombre: 'Nicolás',
      apellido: 'Galarza',
      mail: 'nicolas@example.com',
      fechaNacimiento: new Date('1988-07-22'),
      user: 'nico88',
      password: 'abcd',
      tipoUsuario: 2
    },
    {
      nombre: 'María',
      apellido: 'Pérez',
      mail: 'maria@example.com',
      fechaNacimiento: new Date('1995-11-30'),
      user: 'mariap',
      password: '5678',
      tipoUsuario: 2
    }
  ];
  public usuarioParaEditar: Usuario | null = null;


 
  constructor() { }

  // ✅ Eliminar usuario por nombre de usuario
  eliminarUsuario(user: string): void {
    this.listaUsuario = this.listaUsuario.filter(u => u.user !== user);
  }
   modificarUsuario(usuarioModificado: Usuario): void {
    const index = this.listaUsuario.findIndex(u => u.user === usuarioModificado.user);
    if (index !== -1) {
      this.listaUsuario[index] = { ...usuarioModificado };
    }
  }
}

