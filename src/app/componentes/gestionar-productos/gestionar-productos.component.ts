import { Component } from '@angular/core';
import { Productos } from '../../entidades/productos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { FiltroProductoPipe } from '../../pipe/filtro-producto.pipe';

@Component({
  selector: 'app-gestionar-productos',
  imports: [ReactiveFormsModule,CommonModule,RouterModule,FormsModule,FiltroProductoPipe],
  templateUrl: './gestionar-productos.component.html',
  styleUrl: './gestionar-productos.component.css'
})
export class GestionarProductosComponent {
 form!: FormGroup;
  productos: Productos[] = [];
  editMode: boolean = false;
  editId!: number;
  filtroTexto = '';

  constructor(private fb: FormBuilder, private productoService: ProductosServiceService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: [''],
      precioArs: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen: ['', Validators.required]
    });

    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.obtenerProductos([]).subscribe((data: Productos[]) => {
      this.productos = data;
    });
  }

  submit(): void {
    const producto: Productos = this.form.value;

    if (this.editMode) {
      this.productoService.actualizarProducto(producto).subscribe(() => {
        this.cargarProductos();
        this.resetForm();
      });
    } else {
      this.productoService.crearProducto(producto).subscribe(() => {
        this.cargarProductos();
        this.resetForm();
      });
    }
  }

  editar(producto: Productos): void {
    this.form.patchValue(producto);
    this.editMode = true;
  }

  eliminar(producto: Productos): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(producto).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  resetForm(): void {
    this.editMode = false;
    this.form.reset({ nombre: '', descripcion: '', precioArs: 0, categoria: '', imagen: '' });
  }
}


