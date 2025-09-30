import { Component, inject, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ChatService, ConversacionFS, MensajeFS } from '../../servicios/chat.service';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-chat-burbuja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <!-- Botón  -->
  <button class="fab" (click)="toggle()">
    💬
    <span class="badge" *ngIf="hasNotif()">●</span>
  </button>

  <!-- Panel -->
  <div class="panel" *ngIf="open()">
    <div class="panel-header">
      <div class="tabs">
        <button [class.active]="tab()==='convs'" (click)="tab.set('convs')">Conversaciones</button>
        <button *ngIf="miRol==='admin'" [class.active]="tab()==='pend'" (click)="tab.set('pend')">Pendientes</button>
      </div>
      <button class="close" (click)="open.set(false)">✕</button>
    </div>

    <div class="panel-body">
      <aside class="col col-list">
        <!-- Usuario:  -->
        <div class="new" *ngIf="miRol==='usuario' && tab()==='convs'">
          <button class="btn-full" (click)="nuevoChatConSoporte()">Nuevo chat con soporte</button>

          
        </div>

        <!-- Lista conversaciones -->
        <div class="list" *ngIf="tab()==='convs'">
          <div class="item" *ngFor="let c of conversaciones(); trackBy: trackConv" (click)="abrir(c)">
            <div class="title">{{ titulo(c) }}</div>
            <div class="last">{{ c.ultimoMensaje }}</div>
          </div>
          <div class="empty-list" *ngIf="!conversaciones().length">No hay conversaciones</div>
        </div>

        <!-- Admin: pendientes -->
        <div class="users" *ngIf="tab()==='pend' && miRol==='admin'">
          <div class="list">
            <div class="item" *ngFor="let c of pendientes(); trackBy: trackConv"
                 (click)="abrirTomando(c)">
              <div class="title">
                {{ titulo(c) }} • (pendiente)
              </div>
              <div class="last">{{ c.ultimoMensaje || '—' }}</div>
            </div>
            <div class="empty-list" *ngIf="!pendientes().length">No hay pendientes</div>
          </div>
        </div>
      </aside>

      <main class="col col-chat" *ngIf="cid(); else empty">
        <div #msgs class="msgs">
          <div class="msg" *ngFor="let m of mensajes(); trackBy: trackMsg" [class.me]="m.remitenteId===miId">
            <div class="bubble">
              <div class="meta">{{ m.remitenteId===miId ? 'Yo' : nombreDe(m.remitenteId) }}</div>
              <div class="text">{{ m.texto }}</div>
            </div>
          </div>
        </div>
        <form class="composer" (ngSubmit)="enviar()">
          <input [(ngModel)]="draft" name="draft" placeholder="Escribí un mensaje…" />
          <div class="actions">
            <button type="submit">Enviar</button>
            <button type="button" class="ghost" (click)="cerrar()" *ngIf="cid()">Cerrar</button>
          </div>
        </form>
      </main>

      <ng-template #empty>
        <main class="col col-chat empty">Elegí o creá un chat</main>
      </ng-template>
    </div>
  </div>
  `,
  styles: [`
    .fab{
      position:fixed; right:16px; bottom:16px; z-index:1000;
      width:56px; height:56px; border-radius:50%;
      border:none; background:#e91e63; color:#fff; font-size:22px;
      box-shadow:0 6px 16px rgba(0,0,0,.25); cursor:pointer;
      transition: transform .1s ease-in-out;
    }
    .fab:hover{ transform: translateY(-2px); }
    .badge{ position:absolute; right:10px; top:6px; color:#ff5252; font-size:18px; }

    .panel{
      position:fixed; right:16px; bottom:80px; width:820px; max-width:92vw; height:560px;
      background:#fff; border:1px solid #f0c3d1; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.2);
      display:flex; flex-direction:column; z-index:1001;
    }
    .panel-header{
      display:flex; align-items:center; justify-content:space-between;
      padding:10px 12px; border-bottom:1px solid #f8d4e0; background:#ffe7ef;
    }
    .tabs{ display:flex; gap:8px; }
    .tabs button{
      border:0; background:transparent; padding:6px 10px; border-radius:8px; cursor:pointer; font-weight:600;
    }
    .tabs button.active{ background:#fff; border:1px solid #f8d4e0; }

    .close{ border:none; background:transparent; font-size:18px; cursor:pointer; }

    .panel-body{ display:flex; flex:1; min-height:0; }
    .col{ display:flex; flex-direction:column; }
    .col-list{ width:300px; border-right:1px solid #f8d4e0; }

    .new{ padding:10px; border-bottom:1px solid #f8d4e0; }
    .btn-full{ width:100%; border:0; background:#e91e63; color:#fff; padding:8px 10px; border-radius:8px; cursor:pointer; }
    .link{ display:inline-block; margin-top:6px; cursor:pointer; color:#e91e63; }

    .list{ overflow:auto; padding:8px; display:flex; flex-direction:column; gap:8px; }
    .item{ border:1px solid #f1d1dc; border-radius:12px; padding:10px; cursor:pointer; background:#fff; }
    .item:hover{ background:#fff6f9; }
    .title{ font-weight:600; }
    .last{ font-size:12px; opacity:.75; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

    .col-chat{ flex:1; display:flex; flex-direction:column; }
    .col-chat.empty{ display:flex; align-items:center; justify-content:center; color:#777; }
    .msgs{ flex:1; overflow:auto; padding:12px; display:flex; flex-direction:column; gap:8px; }
    .msg .bubble{ max-width:70%; background:#fdf2f6; padding:8px 12px; border-radius:12px; }
    .msg.me .bubble{ margin-left:auto; background:#e0ffe3; }
    .meta{ font-size:11px; opacity:.65; margin-bottom:4px; }
    .composer{ display:flex; gap:8px; border-top:1px solid #f8d4e0; padding:10px; }
    .composer input{ flex:1; padding:10px; border:1px solid #e0b3c3; border-radius:10px; }
    .actions{ display:flex; gap:8px; }
    .composer button{ border:0; background:#e91e63; color:#fff; padding:8px 12px; border-radius:10px; cursor:pointer; }
    .composer .ghost{ background:#fff; color:#e91e63; border:1px solid #e91e63; }
  `]
})
export class ChatBurbujaComponent {
  private chat = inject(ChatService);
  private usuarioSrv = inject(UsuarioService);

  miId = this.usuarioSrv.miId() ?? '';
  miRol: 'admin' | 'usuario' = this.usuarioSrv.rol();

  open = signal(false);
  tab = signal<'convs'|'pend'>('convs');

  conversaciones = signal<(ConversacionFS & {id:string})[]>([]);
  pendientes = signal<(ConversacionFS & {id:string})[]>([]);   // solo admin
  cid = signal<string | null>(null);
  mensajes = signal<(MensajeFS & {id:string})[]>([]);

  draft = '';

  // nombres cacheados para mostrar remitentes/participantes
  nombres: Record<string,string> = {};
  nombreDe = (id: string) => this.nombres[id] ?? id;

  hasNotif = computed(() =>
    this.conversaciones().some(c => c.ultimoRemitenteId && c.ultimoRemitenteId !== this.miId)
  );

  private mensajesSub?: Subscription;

  @ViewChild('msgs', { static: false }) msgsRef?: ElementRef<HTMLDivElement>;

  ngOnInit() {
    if (!this.miId) return;

    // mis conversaciones (usuario o admin)
    this.chat.listenConversacionesDe(this.miId).subscribe(async cs => {
      this.conversaciones.set(cs);
      for (const c of cs) {
        const otro = (c.participantesIds || []).find(x => x !== this.miId);
        if (otro && !this.nombres[otro]) {
          const disp = await this.usuarioSrv.getNombreConRol(otro);
          this.nombres = { ...this.nombres, [otro]: disp };
        }
      }
    });

    // Admin: bandeja pendientes
    if (this.miRol === 'admin') {
      this.chat.listenPendientesParaAdmin().subscribe(cs => this.pendientes.set(cs));
    }
  }

  toggle(){ this.open.update(v => !v); }

  titulo(c: ConversacionFS & {id:string}) {
    const otro = (c.participantesIds || []).find(x => x !== this.miId);
    return (otro && this.nombreDe(otro)) || 'Chat';
  }

  abrir(c: {id:string}) {
    this.cid.set(c.id);
    this.mensajesSub?.unsubscribe();
    this.mensajesSub = this.chat.listenMensajesDeConversacion(c.id).subscribe(async ms => {
      this.mensajes.set(ms);
      for (const m of ms) {
        if (!this.nombres[m.remitenteId]) {
          const disp = await this.usuarioSrv.getNombreConRol(m.remitenteId);
          this.nombres = { ...this.nombres, [m.remitenteId]: disp };
        }
      }
      this.scrollToBottom();
    });
  }

  // ===== Usuario =====
  
  async nuevoChatConSoporte(){
    if (!this.miId) return;
    const id = await this.chat.crearConversacionSoporteNueva(this.miId);
    this.tab.set('convs');
    this.abrir({ id });
  }

  
  async nuevoChatConSoporteReutilizable(){
    if (!this.miId) return;
    const id = await this.chat.crearConversacionSoporte(this.miId);
    this.tab.set('convs');
    this.abrir({ id });
  }

  //  Admin 
  
  async abrirTomando(c: (ConversacionFS & {id:string})) {
    if (this.miRol === 'admin') {
      await this.chat.tomarConversacion(c.id, this.miId);
      const tomado = {
        ...c,
        participantesIds: Array.from(new Set([...(c.participantesIds ?? []), this.miId])),
        estado: 'en_curso' as const
      };
      this.conversaciones.update(list => [tomado as any, ...list.filter(x => x.id !== c.id)]);
    }
    this.tab.set('convs');
    this.abrir(c);
  }

  async enviar(){
    const txt = this.draft.trim();
    if (!txt || !this.cid()) return;
    await this.chat.enviarMensaje(this.cid()!, this.miId, txt);
    this.draft = '';
    this.scrollToBottom();
  }

  //Cerrar conversación
  async cerrar(){
    if (!this.cid()) return;
    await this.chat.cerrarConversacion(this.cid()!);
    this.cid.set(null);
  }

  
  trackConv = (_: number, c: any) => c.id;
  trackMsg  = (_: number, m: any) => m.id ?? m.ts ?? Math.random();

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.msgsRef?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }
}
