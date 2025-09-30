import { Component, OnInit } from '@angular/core';
import { Productos } from '../../entidades/productos';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { CommonModule } from '@angular/common';
import { FacturaComponent, ProductoFactura } from '../factura/factura.component';
import { FiltroProductoPipe } from '../../pipe/filtro-producto.pipe';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../servicios/usuario.service'; // ***

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

  // ***
  constructor(
    private productoService: ProductosServiceService,
    private usuarioService: UsuarioService,          // ***
  ) {}

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
    if (!event) {
      console.error("No se recibio evento de factura");
      return;
    }

    // *** Tomamos el usuario logueado para id_usuario
    const u = this.usuarioService.getUsuarioLogueado();
    if (!u) {
      alert('Debes iniciar sesión para confirmar la compra.');
      return;
    }
    const id_usuario = u.id;

    // *** Fecha a guardar (formato YYYY-MM-DD HH:mm:ss)
    const fecha_cotizacion = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // *** Enviar UNA FILA POR PRODUCTO seleccionado
    const observables = this.productosSeleccionados.map(sel => {
      const precio_unitario = Number(sel.producto.precioArs);
      const cantidad = Number(sel.cantidad);
      const total_ars = precio_unitario * cantidad;
      const total_usd = Number((total_ars / event.tipoCambio).toFixed(2));

      const payload = {
        id_usuario: id_usuario,                 // ***
        id_producto: sel.producto.id,           // ***
        cantidad: cantidad,
        precio_unitario: precio_unitario,
        total_ars: total_ars,
        total_usd: total_usd,
        cotizacion_usd: event.tipoCambio,
        fecha_cotizacion: fecha_cotizacion
      };

      console.log('POST /crear_factura payload:', payload);
      // POST a /crear_factura por cada ítem
      return this.productoService.crearFactura(payload);
    });

    // Ejecutamos todos los POST
    let completados = 0, conError = false;
    observables.forEach(obs => {
      obs.subscribe({
        next: () => { completados++; },
        error: (err) => { conError = true; console.error('Error al enviar item de factura', err); },
        complete: () => {
          if (completados === observables.length) {
            if (conError) {
              alert('La compra se registró con errores en algunos items. Revisar consola.');
            } else {
              alert('¡Compra confirmada!');
            }
            this.productosSeleccionados = [];
          }
        }
      });
    });
  }

  get productosParaFactura(): ProductoFactura[] {
    return this.productosSeleccionados.map(p => ({
      nombre: p.producto.nombre,
      cantidad: p.cantidad,
      precioArs: p.producto.precioArs
    }));
  }
}
