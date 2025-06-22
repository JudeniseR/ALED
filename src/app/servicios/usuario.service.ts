import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




export interface Usuario {
  nombre?: string;
  apellido?: string;
  mail?: string;
  fechaNacimiento?: string | Date;
  user: string;
  password: string;
  tipoUsuario?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuarioParaEditar:Usuario = {nombre: '',
    apellido: '',
    mail: '',
    fechaNacimiento: '',
    user: '',
    password: '',
    tipoUsuario: 0}
  public listaUsuario:Usuario[] =[]
  private apiUrl = 'https://julieta_denise_rojas-apialed.mdbgo.io';

  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario){
    return this.http.post(this.apiUrl+ "/registro", usuario);
  }

  login(usuario:Usuario) {
    return this.http.post(this.apiUrl + "/login", usuario);

  }
}
