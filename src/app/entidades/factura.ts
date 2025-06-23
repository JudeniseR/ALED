export interface Factura {
    id?: number;
  cantidad: number;
  precio_unitario?: number;
  total_ars: number;
  total_usd: number;
  cotizacion_usd: number;
  fecha_cotizacion: string;
}
