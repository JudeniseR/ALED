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
  const cotizacionUSD = 1162;
  const fechaHoy = new Date().toISOString().split('T')[0];

  let cantidadTotal = 0;
  let totalArs = 0;

  this.productosSeleccionados.forEach((seleccion) => {
    cantidadTotal += seleccion.cantidad;
    totalArs += seleccion.cantidad * seleccion.producto.precioArs;
  });

  const totalUsd = +(totalArs / cotizacionUSD).toFixed(2);

  const factura = {
    cantidad: cantidadTotal,
    precio_unitario: 0, // opcional, o podrías poner un promedio si necesitás
    total_ars: totalArs,
    total_usd: totalUsd,
    cotizacion_usd: cotizacionUSD,
    fecha_cotizacion: fechaHoy
  };

  console.log("Factura enviada:", factura);
  this.productoService.crearFactura(factura).subscribe({
    next: () => console.log('Factura enviada correctamente'),
    error: err => console.error('Error al enviar factura', err)
  });

  alert('Compra confirmada!');
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
