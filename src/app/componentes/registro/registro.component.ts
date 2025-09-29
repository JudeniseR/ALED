// src/app/componentes/registro/registro.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UsuarioService } from '../../servicios/usuario.service';
import { ChatService } from '../../servicios/chat.service';

@Component({
  selector: 'app-registro',
  standalone: true, // <- importante si usás "imports"
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  errorMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private chat: ChatService,            // <-- inyectá ChatService (exportado arriba)
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      user: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipoUsuario: [1, Validators.required]
    });
  }

  guardar(): void {
    this.errorMessage = '';
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
      return;
    }

    const nuevoUsuario = {
      ...this.registroForm.value,
      mail: String(this.registroForm.value.mail || '').trim().toLowerCase(),
      tipoUsuario: Number(this.registroForm.value.tipoUsuario || 1)
    };

    this.loading = true;

    this.usuarioService.registrar(nuevoUsuario).subscribe({
      next: async (res: any) => {
        try {
          const creado = {
            id: res?.id ?? res?.insertId ?? res?.usuario?.id ?? nuevoUsuario?.id,
            nombre: res?.nombre ?? res?.usuario?.nombre ?? nuevoUsuario.nombre,
            apellido: res?.apellido ?? res?.usuario?.apellido ?? nuevoUsuario.apellido,
            mail: res?.mail ?? res?.usuario?.mail ?? nuevoUsuario.mail,
            tipoUsuario: Number(res?.tipoUsuario ?? res?.usuario?.tipoUsuario ?? nuevoUsuario.tipoUsuario),
            fotoURL: null as string | null
          };

          if (creado.id) {
            await this.chat.upsertUsuario(creado); // <-- guarda en Firestore
          } else {
            console.warn('[Registro] La API no devolvió ID; no se creó doc en Firestore.');
          }

          this.router.navigate(['/login']).then(() => (this.loading = false));
        } catch (e) {
          console.error('[Registro] Firestore error:', e);
          this.loading = false;
          this.errorMessage = 'Usuario creado. Hubo un problema al sincronizar con el chat.';
        }
      },
      error: (err) => {
        console.error('[Registro] Error API:', err);
        this.loading = false;
        this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
      }
    });
  }
}
