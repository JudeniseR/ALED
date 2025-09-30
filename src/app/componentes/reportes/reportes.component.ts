// src/app/componentes/reportes/reportes.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ReportesService, Venta, DolarPunto, TopProducto } from '../../services/reportes.service';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  standalone: true,
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  imports: [CommonModule, BaseChartDirective],
})
export class ReportesComponent implements OnInit {
  private srv = inject(ReportesService);

  // filtros
  rango: 'dia' | 'semana' | 'mes' = 'dia';

  // estado
  cargando = signal(true);
  error    = signal<string | null>(null);

  // datos
  ventas = signal<Venta[]>([]);
  dolar  = signal<DolarPunto[]>([]);
  top    = signal<TopProducto[]>([]);

  // opciones comunes para todos los charts
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,     // 👈 importante para que respete la altura del contenedor
    layout: { padding: 12 },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  // Ventas
  ventasChart: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Ventas' }] };
  ventasType: ChartType = 'bar';

  // Dólar
  dolarChart: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'USD (semanal)' }] };
  dolarType: ChartType = 'line';

  // Top productos
  topChart: ChartConfiguration['data'] = { labels: [], datasets: [{ data: [], label: 'Unidades' }] };
  topType: ChartType = 'bar';

  async ngOnInit() {
    await this.cargarTodo();
  }

  async cargarTodo() {
    this.cargando.set(true);
    this.error.set(null);
    try {
      const [ventas, dolar, top] = await Promise.all([
        this.srv.getVentas(this.rango),
        this.srv.getDolarSemanal(),
        this.srv.getTopProductos()
      ]);

      this.ventas.set(ventas);
      this.dolar.set(dolar);
      this.top.set(top);

      this.ventasChart = {
        labels: ventas.map(v => v.periodo),
        datasets: [{ data: ventas.map(v => v.cantidad), label: 'Ventas' }]
      };
      this.dolarChart = {
        labels: dolar.map(d => d.semana),
        datasets: [{ data: dolar.map(d => d.valor), label: 'USD (semana)' }]
      };
      this.topChart = {
        labels: top.map(t => t.producto),
        datasets: [{ data: top.map(t => t.cantidad), label: 'Unidades' }]
      };
    } catch (e: any) {
      this.error.set('No se pudieron cargar los datos de reportes.');
      console.error(e);
    } finally {
      this.cargando.set(false);
    }
  }

  cambiarRango(r: 'dia' | 'semana' | 'mes') {
    if (this.rango !== r) {
      this.rango = r;
      this.cargarTodo();
    }
  }

  exportarCSV() {
    this.srv.exportCSVFacturas();
  }
}
