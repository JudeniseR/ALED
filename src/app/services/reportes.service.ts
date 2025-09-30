// src/app/services/reportes.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Venta = { periodo: string; cantidad: number; };
export type DolarPunto = { semana: string; valor: number; };
export type TopProducto = { producto: string; cantidad: number; };

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private http = inject(HttpClient);
  private base = 'https://julieta_denise_rojas-apialed.mdbgo.io/api/reportes';

  getVentas(rango: 'dia'|'semana'|'mes') {
    return firstValueFrom(this.http.get<Venta[]>(`${this.base}/ventas?rango=${rango}`));
  }

  getDolarSemanal() {
    return firstValueFrom(this.http.get<DolarPunto[]>(`${this.base}/dolar-semanal`));
  }

  getTopProductos() {
    return firstValueFrom(this.http.get<TopProducto[]>(`${this.base}/top-productos`));
  }

  exportCSVFacturas() {
    this.http.get(`${this.base}/facturas-csv`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'facturas.csv';
        a.click();
        URL.revokeObjectURL(url);
      });
  }
}
