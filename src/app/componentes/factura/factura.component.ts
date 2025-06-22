import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoCambioService } from '../../servicios/tipo-cambio.service';

export interface ProductoFactura {
  nombre: string;
  cantidad: number;
  precioArs: number;
}

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  @Input() productos: ProductoFactura[] = [];
  @Output() compraConfirmada = new EventEmitter<void>();

  tipoCambio: number = 1;
  totalArs: number = 0;
  totalUsd: number = 0;

  constructor(private tipoCambioService: TipoCambioService) {}

  ngOnInit(): void {
    this.calcularTotales();

    this.tipoCambioService.obtenerTipoCambio().subscribe(valor => {
      this.tipoCambio = valor;
      this.totalUsd = this.totalArs / this.tipoCambio;
    });
  }

  calcularTotales(): void {
    this.totalArs = this.productos.reduce((sum, p) => sum + p.precioArs * p.cantidad, 0);
    this.totalUsd = this.totalArs / this.tipoCambio;
  }

  confirmar(): void {
    this.compraConfirmada.emit();
  }
}
