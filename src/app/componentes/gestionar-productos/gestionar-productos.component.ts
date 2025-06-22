import { Component, OnInit } from '@angular/core';
import { Productos } from '../../entidades/productos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { FiltroProductoPipe } from '../../pipe/filtro-producto.pipe';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gestionar-productos',
  imports: [ReactiveFormsModule,CommonModule,FormsModule,RouterModule,FiltroProductoPipe],
  templateUrl: './gestionar-productos.component.html',
  styleUrl: './gestionar-productos.component.css'
})
export class GestionarProductosComponent implements OnInit {
  productos: Productos[] = [];
  filtroTexto = '';

  constructor(
    private productoService: ProductosServiceService,
    private router: Router
) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos([]).subscribe((data: Productos[]) => {
      this.productos = data;
    });
  }

  editar(producto: Productos): void {
  localStorage.setItem('productoEditar', JSON.stringify(producto));
  this.router.navigate(['/editar-producto']);
}


  eliminar(producto: Productos): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(producto).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}


