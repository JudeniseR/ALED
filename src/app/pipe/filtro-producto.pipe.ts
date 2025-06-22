
// src/app/pipes/filtro-producto.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Productos } from '../entidades/productos';


@Pipe({
  name: 'filtroProducto',
  standalone: true
})
export class FiltroProductoPipe implements PipeTransform {
  transform(productos: Productos[], texto: string): Productos[] {
    if (!texto) return productos;
    texto = texto.toLowerCase();
    return productos.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.categoria.toLowerCase().includes(texto)
    );
  }
}
