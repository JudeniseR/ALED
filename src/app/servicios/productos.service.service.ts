import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Productos } from '../entidades/productos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosServiceService {



  private apiUrl = 'https://julieta_denise_rojas-apialed.mdbgo.io';
  constructor(private http: HttpClient) { }

  obtenerProductos(payload: any): Observable<Productos[]> {
  return this.http.post<Productos[]>(this.apiUrl + "/obtener_productos", payload);
}

    actualizarProducto(producto:Productos){
      return this.http.post(this.apiUrl+ "/actualizar_producto",producto);
    }

    crearProducto(producto:Productos){
      return this.http.post(this.apiUrl+ "/crear_producto",producto);
    }

    eliminarProducto(producto:Productos){
      return this.http.post(this.apiUrl+ "/eliminar_producto",producto);
    }

}
