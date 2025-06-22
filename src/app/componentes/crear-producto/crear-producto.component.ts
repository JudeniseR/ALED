import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Productos } from '../../entidades/productos';
import { CommonModule } from '@angular/common';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-producto',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent {
    @Output() productoCreado = new EventEmitter<Productos>();

  form: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private productoService:ProductosServiceService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precioArs: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
  const nuevoProducto = this.form.value;

  this.productoService.crearProducto(nuevoProducto).subscribe({
    next: () => this.router.navigate(['/gestionar-productos']),
    error: (err) => {
      this.errorMessage = 'Error al crear el producto. Intente nuevamente.';
      console.error('Error:', err);
    }
  });
} else {
  this.errorMessage = 'Por favor complete todos los campos correctamente.';
}

  }
}
