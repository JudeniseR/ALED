import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, shareReplay } from 'rxjs/operators';

interface Cotizacion {
  fecha: string;
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {
  private apiUrl = 'https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/USD';

  // Cache con refresco cada 10 minutos para no saturar la API
  tipoCambio$: Observable<number> = timer(0, 600000).pipe( // cada 10 minutos
    switchMap(() => this.obtenerTipoCambioHoy()),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  private obtenerTipoCambioHoy(): Observable<number> {
    const hoy = new Date().toISOString().slice(0, 10);
    const url = `${this.apiUrl}?fechaDesde=${hoy}&fechaHasta=${hoy}`;

    return this.http.get<Cotizacion[]>(url).pipe(
      map((data) => {
        if (data && data.length > 0) {
          return data[data.length - 1].valor;
        }
        return 1;
      }),
      catchError((err) => {
        console.error('Error al obtener tipo de cambio del BCRA', err);
        return of(1); // fallback tipo cambio 1 si error
      })
    );
  }

  // Método público para obtener el Observable del tipo cambio
  obtenerTipoCambio(): Observable<number> {
    return this.tipoCambio$;
  }
}
