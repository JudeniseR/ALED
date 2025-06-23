import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, switchMap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TipoCambioService {
  public fechaCotizacionUsada: string = '';
  private apiUrl = 'https://api.bcra.gob.ar/estadisticascambiarias/v1.0/Cotizaciones/USD';

  tipoCambio$: Observable<number> = timer(0, 600000).pipe(
    switchMap(() => this.obtenerUltimoTipoCambio()),
    shareReplay(1)
  );

  constructor(private http: HttpClient) {}

  private obtenerUltimoTipoCambio(): Observable<number> {
  return this.http.get<any>(this.apiUrl).pipe(
    map((respuesta) => {
      const primeraCotizacion = respuesta?.results?.[0];
      const cotizacion = primeraCotizacion?.detalle?.[0]?.tipoCotizacion;

      if (cotizacion) {
        this.fechaCotizacionUsada = primeraCotizacion.fecha;
        return cotizacion;
      } else {
        console.warn('No se encontró cotización válida');
        return 1; // fallback
      }
    }),
    catchError((err) => {
      console.error('Error al obtener tipo de cambio del BCRA', err);
      return of(1);
    })
  );
}


  obtenerTipoCambio(): Observable<number> {
    return this.tipoCambio$;
  }
}
