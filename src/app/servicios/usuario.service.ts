import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// AngularFire Firestore
import {
  Firestore, doc, getDoc, setDoc, collection, getDocs
} from '@angular/fire/firestore';

// ====== Tipos de tu API ======
export interface Usuario {
  nombre?: string;
  apellido?: string;
  mail?: string;
  fechaNacimiento?: string | Date;
  user: string;
  password: string;
  tipoUsuario?: number;          // 1 = usuario, 2 = admin
}



// Lo que guardás en localStorage (según tu app)
export interface UsuarioLogueado {
  id: number | string;
  nombre: string;
  apellido: string;
  mail: string;
  user: string;
  password?: string;
  tipoUsuario: number;           // 1 = usuario, 2 = admin
  fechaNacimiento?: string | Date;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  // (tu API REST)
  private apiUrl = 'https://julieta_denise_rojas-apialed.mdbgo.io';

  // ==== Helpers de sesión (localStorage) ====
  private readonly LS_KEY = 'usuarioLogueado';

  constructor(private http: HttpClient, private db: Firestore) {}

  public usuarioParaEditar: Usuario = {
    nombre: '', apellido: '', mail: '', fechaNacimiento: '',
    user: '', password: '', tipoUsuario: 0
  };

  public listaUsuario: Usuario[] = [];

  getUsuarioLogueado(): UsuarioLogueado | null {
    try {
      const raw = localStorage.getItem(this.LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UsuarioLogueado;
    } catch { return null; }
  }

  miId(): string | null {
    const u = this.getUsuarioLogueado();
    return u ? String(u.id) : null;
  }

  esAdmin(): boolean {
    const u = this.getUsuarioLogueado();
    return !!u && Number(u.tipoUsuario) === 2;
  }

  rol(): 'admin' | 'usuario' {
    return this.esAdmin() ? 'admin' : 'usuario';
  }

  // ===================== API (sin cambios) =====================
  registrar(usuario: Usuario) {
    return this.http.post(this.apiUrl + '/registro', usuario);
  }
  login(usuario: Usuario) {
    return this.http.post(this.apiUrl + '/login', usuario);
  }
  // ============================================================

  // ===================== Firestore helpers =====================

  /** Crea/actualiza el perfil del usuario en /usuarios/{id} */
  async upsertUsuarioFs(u: {
    id: string | number;
    nombre?: string; apellido?: string; mail?: string;
    tipoUsuario: number; rol?: 'admin' | 'usuario';
  }) {
    const id = String(u.id);
    const data = {
      nombre: u.nombre ?? '',
      apellido: u.apellido ?? '',
      mail: u.mail ?? '',
      tipoUsuario: Number(u.tipoUsuario),
      rol: u.rol ?? (Number(u.tipoUsuario) === 2 ? 'admin' : 'usuario'),
    };
    await setDoc(doc(this.db, 'usuarios', id), data, { merge: true });
  }

  /** Devuelve "Nombre Apellido (rol)" de /usuarios/{id} y lo cachea. */
  private cacheNombrePorId: Record<string, string> = {};
  async getNombreConRol(id: string): Promise<string> {
    if (this.cacheNombrePorId[id]) return this.cacheNombrePorId[id];
    const snap = await getDoc(doc(this.db, `usuarios/${id}`));
    if (!snap.exists()) {
      this.cacheNombrePorId[id] = id;
      return id;
    }
    const d = snap.data() as any;
    const rol = d?.rol || (Number(d?.tipoUsuario) === 2 ? 'admin' : 'usuario');
    const nombre = [d?.nombre, d?.apellido].filter(Boolean).join(' ');
    const display = nombre ? `${nombre} (${rol})` : `${id} (${rol})`;
    this.cacheNombrePorId[id] = display;
    return display;
  }

  /** Log rápido para ver qué hay en /usuarios (útil debug). */
  async debugAdminsLog(): Promise<void> {
    const all = await getDocs(collection(this.db, 'usuarios'));
    console.log('[DEBUG usuarios]', all.docs.map(d => ({ id: d.id, ...d.data() })));
  }
}
