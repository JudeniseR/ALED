import { Component, OnInit } from '@angular/core';
import { Productos } from '../../entidades/productos';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { CommonModule } from '@angular/common';
import { FacturaComponent } from '../factura/factura.component';
import { FiltroProductoPipe } from '../../pipe/filtro-producto.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seleccionar-productos',
  imports: [CommonModule,FacturaComponent,FiltroProductoPipe,FormsModule],
  templateUrl: './seleccionar-productos.component.html',
  styleUrls: ['./seleccionar-productos.component.css']
})
export class SeleccionarProductosComponent implements OnInit {
  productos: Productos[] = [];
  productosSeleccionados: { producto: Productos; cantidad: number }[] = [];

  filtroTexto = '';

  constructor(private productoService: ProductosServiceService) {}

  ngOnInit(): void {
    // Pasamos payload vacío según tu método POST
    this.productoService.obtenerProductos([]).subscribe((data) => {
      this.productos = data;
    });
  }

  agregarProducto(producto: Productos, cantidadInput: HTMLInputElement) {
    const cantidad = Number(cantidadInput.value);
    if (cantidad > 0) {
      const existente = this.productosSeleccionados.find(p => p.producto.id === producto.id);
      if (existente) {
        existente.cantidad += cantidad;
      } else {
        this.productosSeleccionados.push({ producto, cantidad });
      }
      cantidadInput.value = '';
    }
  }

  eliminarSeleccionado(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  onCompraConfirmada() {
    alert('Compra confirmada!');

    // Limpiamos selección para nueva compra
    this.productosSeleccionados = [];
  }

  get productosParaFactura() {
  return this.productosSeleccionados.map(p => ({
    nombre: p.producto.nombre,
    cantidad: p.cantidad,
    precioArs: p.producto.precioArs
  }));
}
}
