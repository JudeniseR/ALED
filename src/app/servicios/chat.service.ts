// src/app/services/chat.service.ts
import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Firestore, doc, setDoc, getDoc, collection, addDoc,
  serverTimestamp, query, where, orderBy, limit, collectionData,
  updateDoc, arrayUnion, getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface UsuarioFS {
  nombre: string;
  apellido: string;
  correo: string;
  tipoUsuario: number;
  rol: 'usuario' | 'admin';
  fotoURL?: string | null;
}

/**
 * Conversación con soporte para inbox:
 * - tipo: 'soporte' | 'directo'
 * - assignedAdminId: admin asignado
 * - estado: 'pendiente' | 'en_curso' | 'cerrada'
 * - creadoPor / creadoEn
 */
export interface ConversacionFS {
  participantesIds: string[];
  ultimoMensaje: string;
  ultimoRemitenteId: string;
  actualizadoEn: any;

  // extras soporte
  tipo?: 'soporte' | 'directo';
  assignedAdminId?: string | null;
  estado?: 'pendiente' | 'en_curso' | 'cerrada';
  creadoPor?: string;
  creadoEn?: any;

  // extras opcionales existentes
  esGrupo?: boolean;
  titulo?: string;
}

export interface MensajeFS {
  remitenteId: string;
  texto: string;
  creadoEn: any;
  leidoPor: string[];
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private db  = inject(Firestore);
  private env = inject(EnvironmentInjector); // 👈 agregado

  // ------- Perfiles de usuario en /usuarios --------
  async upsertUsuario(user: {
    id: number | string; nombre: string; apellido: string; mail: string; tipoUsuario: number; fotoURL?: string | null;
  }) {
    const id = String(user.id);
    const data: UsuarioFS = {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.mail,
      tipoUsuario: user.tipoUsuario,
      rol: user.tipoUsuario === 2 ? 'admin' : 'usuario',
      fotoURL: user.fotoURL ?? null
    } as any;
    await setDoc(doc(this.db, `usuarios/${id}`), data, { merge: true });
  }

  // ------- Conversaciones 1 a 1 (id determinístico) -------
  private convId(a: string, b: string) {
    const [x, y] = [a, b].sort();
    return `${x}_${y}`;
  }

  async getOrCreateConversacion1a1(idA: string | number, idB: string | number): Promise<string> {
    const A = String(idA), B = String(idB);
    const cid = this.convId(A, B);
    const ref = doc(this.db, `conversaciones/${cid}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const nueva: ConversacionFS = {
        participantesIds: [A, B],
        ultimoMensaje: '',
        ultimoRemitenteId: '',
        actualizadoEn: serverTimestamp(),

        tipo: 'directo',
        estado: 'en_curso',
        creadoPor: A,
        creadoEn: serverTimestamp(),
        esGrupo: false,
        titulo: ''
      };
      await setDoc(ref, nueva);
    }
    return cid;
  }

  // Stream de conversaciones donde participa el usuario
  listenConversacionesDe(idUsuario: string | number): Observable<(ConversacionFS & { id: string })[]> {
    return runInInjectionContext(this.env, () => {            // 👈 envuelto
      const uid = String(idUsuario);
      const col = collection(this.db, 'conversaciones');
      const q = query(
        col,
        where('participantesIds', 'array-contains', uid),
        orderBy('actualizadoEn', 'desc'),
        limit(50)
      );
      return collectionData(q, { idField: 'id' }) as any;
    });
  }

  // Stream de mensajes (orden por fecha ascendente)
  listenMensajesDeConversacion(idConversacion: string): Observable<(MensajeFS & { id: string })[]> {
    return runInInjectionContext(this.env, () => {            // 👈 envuelto
      const col = collection(this.db, `conversaciones/${idConversacion}/mensajes`);
      const q = query(col, orderBy('creadoEn', 'asc'));
      return collectionData(q, { idField: 'id' }) as any;
    });
  }

  // Envío de mensaje + actualización de cabecera
  async enviarMensaje(idConversacion: string, remitenteId: string | number, texto: string) {
    const mid = String(remitenteId);
    const msgs = collection(this.db, `conversaciones/${idConversacion}/mensajes`);
    const now = serverTimestamp();

    await addDoc(msgs, <MensajeFS>{ remitenteId: mid, texto, creadoEn: now, leidoPor: [mid] });

    await setDoc(doc(this.db, `conversaciones/${idConversacion}`),
      { ultimoMensaje: texto, ultimoRemitenteId: mid, actualizadoEn: now },
      { merge: true }
    );
  }

  // ================== SOPORTE (inbox) ==================

  /** Variante 1 (REUTILIZA si hay abierta) */
  async crearConversacionSoporte(usuarioId: string): Promise<string> {
    const col = collection(this.db, 'conversaciones');

    try {
      const qExist = query(
        col,
        where('tipo', '==', 'soporte'),
        where('creadoPor', '==', usuarioId),
        where('estado', 'in', ['pendiente', 'en_curso']),
        limit(1)
      );
      const exist = await getDocs(qExist);
      if (!exist.empty) return exist.docs[0].id;
    } catch {
      // Si Firestore pide índices o falla, seguimos y creamos nueva.
    }

    const data: ConversacionFS = {
      participantesIds: [usuarioId],
      ultimoMensaje: '',
      ultimoRemitenteId: '',
      actualizadoEn: serverTimestamp(),
      tipo: 'soporte',
      estado: 'pendiente',
      assignedAdminId: null,
      creadoPor: usuarioId,
      creadoEn: serverTimestamp(),
    };
    const ref = await addDoc(col, data as any);
    return ref.id;
  }

  /** Variante 2 (SIEMPRE NUEVA) */
  async crearConversacionSoporteNueva(usuarioId: string): Promise<string> {
    const col = collection(this.db, 'conversaciones');
    const data: ConversacionFS = {
      participantesIds: [usuarioId],
      ultimoMensaje: '',
      ultimoRemitenteId: '',
      actualizadoEn: serverTimestamp(),
      tipo: 'soporte',
      estado: 'pendiente',
      assignedAdminId: null,
      creadoPor: usuarioId,
      creadoEn: serverTimestamp(),
    };
    const ref = await addDoc(col, data as any);
    return ref.id;
  }

  /** Admin: pendientes (sin asignar). */
  listenPendientesParaAdmin(): Observable<(ConversacionFS & {id:string})[]> {
    return runInInjectionContext(this.env, () => {            // 👈 envuelto
      const col = collection(this.db, 'conversaciones');
      const qBase = query(
        col,
        where('tipo', '==', 'soporte'),
        where('estado', '==', 'pendiente'),
        orderBy('actualizadoEn', 'desc'),
        limit(50)
      );
      return collectionData(qBase, { idField: 'id' }) as any;
    });
  }

  /** (Opcional) Cerrar conversación. */
  async cerrarConversacion(convId: string): Promise<void> {
    const ref = doc(this.db, 'conversaciones', convId);
    await updateDoc(ref, {
      estado: 'cerrada',
      actualizadoEn: serverTimestamp(),
    } as any);
  }

  // dentro de ChatService
async tomarConversacion(convId: string, adminId: string): Promise<void> {
  const ref = doc(this.db, 'conversaciones', convId);
  await updateDoc(ref, {
    assignedAdminId: adminId,
    estado: 'en_curso',
    participantesIds: arrayUnion(adminId),
    actualizadoEn: serverTimestamp(),
  } as any);
}
}
