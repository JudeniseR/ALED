import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosServiceService } from '../../servicios/productos.service.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-editar-producto',
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent implements OnInit {
  form!: FormGroup;
  productoId!: number;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductosServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
  const prodGuardado = localStorage.getItem('productoEditar');
  if (prodGuardado) {
    const producto = JSON.parse(prodGuardado);
    this.form = this.fb.group({
      id: [producto.id],
      nombre: [producto.nombre, Validators.required],
      descripcion: [producto.descripcion],
      precioArs: [producto.precioArs, [Validators.required, Validators.min(0)]],
      categoria: [producto.categoria, Validators.required],
      imagen: [producto.imagen, Validators.required]
    });
  } else {
    alert('No hay producto cargado para editar');
    this.router.navigate(['/gestionar-productos']);
  }
}


  submit(): void {
    if (this.form.valid) {
      const productoActualizado = this.form.value;
      this.productoService.actualizarProducto(productoActualizado).subscribe({
        next: () => this.router.navigate(['/gestionar-productos']),
        error: (err) => console.error('Error al actualizar producto:', err)
      });
    }
  }
}
