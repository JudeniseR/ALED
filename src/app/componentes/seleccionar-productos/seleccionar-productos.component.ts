import { Component, OnInit } from '@angular/core';
import { Productos } from '../../entidades/productos';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { CommonModule } from '@angular/common';
import { FacturaComponent, ProductoFactura } from '../factura/factura.component';
import { FiltroProductoPipe } from '../../pipe/filtro-producto.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seleccionar-productos',
  standalone: true,
  imports: [CommonModule, FacturaComponent, FiltroProductoPipe, FormsModule],
  templateUrl: './seleccionar-productos.component.html',
  styleUrls: ['./seleccionar-productos.component.css']
})
export class SeleccionarProductosComponent implements OnInit {
  productos: Productos[] = [];
  productosSeleccionados: { producto: Productos; cantidad: number }[] = [];

  filtroTexto = '';

  constructor(private productoService: ProductosServiceService) {}

  ngOnInit(): void {
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

  onCompraConfirmada(event: {
    tipoCambio: number;
    productos: ProductoFactura[];
    totalArs: number;
    totalUsd: number;
  }) {

    if (!event){
      console.error("No se recibio evento de factura");
      return;
    }
    const fechaHoy = new Date().toISOString().split('T')[0];

    const factura = {
      cantidad: event.productos.reduce((sum, p) => sum + p.cantidad, 0),
      total_ars: event.totalArs,
      total_usd: event.totalUsd,
      cotizacion_usd: event.tipoCambio,
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

  get productosParaFactura(): ProductoFactura[] {
    return this.productosSeleccionados.map(p => ({
      nombre: p.producto.nombre,
      cantidad: p.cantidad,
      precioArs: p.producto.precioArs
    }));
  }
}
