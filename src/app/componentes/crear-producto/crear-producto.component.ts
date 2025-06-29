import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Productos } from '../../entidades/productos';
import { CommonModule } from '@angular/common';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css'
})
export class CrearProductoComponent {
  @Output() productoCreado = new EventEmitter<Productos>();

  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private productoService: ProductosServiceService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precioArs: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required],
      imagen: ['', Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.form.get('imagen')?.setValue(base64); // Guarda Base64 en el formulario
      };
      reader.readAsDataURL(file); // Convierte a Base64
    }
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
