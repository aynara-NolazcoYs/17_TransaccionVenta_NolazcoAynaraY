import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { VentasService } from '../../../core/services/ventas.service';
import { Venta } from '../../../shared/models';

/**
 * Componente de Listado de Ventas
 * Muestra todas las ventas registradas en el sistema
 */
@Component({
  selector: 'app-listado-ventas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="listado-container">
      <h2> Historial de Ventas</h2>

      <!-- Controles -->
      <div class="controles">
        <button (click)="recargarVentas()" class="btn-recargar" [disabled]="cargando">
          {{ cargando ? ' Cargando...' : ' Recargar' }}
        </button>
        <span *ngIf="ventas.length > 0" class="info-total">
          Total de ventas: <strong>{{ ventas.length }}</strong>
        </span>
      </div>

      <!-- Mensaje de vacío -->
      <div *ngIf="ventas.length === 0 && !cargando" class="mensaje-vacio">
        <p>No hay ventas registradas aún. ¡Crea una nueva venta para comenzar!</p>
      </div>

      <!-- Tabla de ventas -->
      <table *ngIf="ventas.length > 0" class="tabla-ventas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Productos</th>
            <th>Total (S/)</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let venta of ventas" class="fila-venta" [attr.data-id]="venta.id">
            <td class="id"><strong>#{{ venta.id }}</strong></td>
            <td class="cliente">{{ venta.nombreCliente }}</td>
            <td class="fecha">{{ formatearFecha(venta.fecha) }}</td>
            <td class="productos">{{ venta.cantidadProductos }}</td>
            <td class="total">S/ {{ venta.totalGeneral.toFixed(2) }}</td>
            <td class="estado">
              <span class="badge" [ngClass]="'badge-' + venta.estado">
                {{ venta.estado | uppercase }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>


  `,
  styles: [`
    .listado-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 25px;
      background-color: #1e293b; /* Slate oscuro */
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid #334155;
    }

    h2 {
      color: #f8fafc;
      margin-bottom: 20px;
      border-bottom: 3px solid #38bdf8; /* Línea Cyan */
      padding-bottom: 10px;
      font-weight: 700;
    }

    .controles {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px 20px;
      background-color: #0f172a;
      border-radius: 8px;
      border-left: 4px solid #38bdf8;
      border-top: 1px solid #334155;
      border-right: 1px solid #334155;
      border-bottom: 1px solid #334155;
    }

    .btn-recargar {
      background-color: #0ea5e9;
      color: #0f172a; /* Texto oscuro para contraste */
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.2s ease-in-out;
    }

    .btn-recargar:hover:not(:disabled) {
      background-color: #38bdf8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
    }

    .btn-recargar:disabled {
      background-color: #334155;
      color: #64748b;
      cursor: not-allowed;
    }

    .info-total {
      font-size: 16px;
      color: #94a3b8;
      font-weight: 500;
    }

    .mensaje-vacio {
      text-align: center;
      padding: 60px 20px;
      color: #94a3b8;
      font-style: italic;
      background-color: #0f172a;
      border-radius: 8px;
      border: 2px dashed #334155;
    }

    .tabla-ventas {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background-color: #0f172a;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #334155;
    }

    .tabla-ventas thead {
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
      color: #0f172a;
    }

    .tabla-ventas th {
      padding: 14px;
      text-align: left;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.05em;
    }

    .tabla-ventas td {
      padding: 14px;
      border-bottom: 1px solid #334155;
      color: #e2e8f0;
    }

    .tabla-ventas tbody tr:hover {
      background-color: rgba(56, 189, 248, 0.05);
    }

    .tabla-ventas tbody tr:nth-child(even) {
      background-color: #1e293b;
    }

    .id {
      color: #38bdf8;
      font-weight: 600;
    }

    .cliente {
      font-weight: 500;
      color: #f1f5f9;
    }

    .fecha {
      color: #94a3b8;
      font-size: 14px;
    }

    .productos {
      text-align: center;
      background-color: rgba(56, 189, 248, 0.15);
      font-weight: 600;
      border-radius: 6px;
      color: #38bdf8;
      padding: 2px 8px;
      display: inline-block;
    }

    .total {
      text-align: right;
      font-weight: 600;
      color: #38bdf8;
      font-size: 16px;
    }

    .estado {
      text-align: center;
    }

    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px; /* Badges un poco más rectangulares modernos */
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .badge-completada {
      background-color: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge-pendiente {
      background-color: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .badge-cancelada {
      background-color: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .resumen-estadistico {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
      padding: 20px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 12px;
      border: 1px solid #334155;
    }

    .estadistica {
      background-color: rgba(30, 41, 59, 0.7);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .estadistica .label {
      display: block;
      color: #94a3b8;
      font-size: 13px;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .estadistica .valor {
      display: block;
      color: #38bdf8;
      font-size: 22px;
      font-weight: 700;
    }

    @media (max-width: 768px) {
      .tabla-ventas {
        font-size: 14px;
      }

      .tabla-ventas th,
      .tabla-ventas td {
        padding: 10px;
      }

      .resumen-estadistico {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class ListadoVentasComponent implements OnInit, OnDestroy {
  private ventasService = inject(VentasService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  
  ventas: Venta[] = [];
  cargando = false;
  private eventListener: (() => void) | null = null;

  ngOnInit(): void {
    this.cargarVentas();
    this.escucharNuevasVentas();
  }

  ngOnDestroy(): void {
    if (this.eventListener) {
      window.removeEventListener('ventaRegistrada', this.eventListener as EventListener);
    }
  }

  /**
   * Carga las ventas desde el servicio
   */
  private cargarVentas(): void {
    this.cargando = true;
    console.log('🔄 Cargando ventas...');
    
    this.ventasService.getVentas()
      .then((ventas) => {
        console.log('✅ Ventas cargadas:', ventas.length);
        this.ngZone.run(() => {
          this.ventas = ventas;
          this.cargando = false;
          this.cdr.markForCheck();
        });
      })
      .catch((error) => {
        console.error('❌ Error al cargar ventas:', error);
        this.ngZone.run(() => {
          this.cargando = false;
          this.cdr.markForCheck();
        });
      });
  }

  /**
   * Escucha el evento de nueva venta registrada
   */
  private escucharNuevasVentas(): void {
    this.eventListener = () => {
      this.recargarVentas();
    };
    window.addEventListener('ventaRegistrada', this.eventListener as EventListener);
  }

  /**
   * Recarga la lista de ventas
   */
  recargarVentas(): void {
    this.cargarVentas();
  }

  /**
   * Calcula el total vendido
   */
  calcularTotalVendido(): number {
    return this.ventas.reduce((sum, venta) => sum + venta.totalGeneral, 0);
  }

  /**
   * Calcula el promedio por venta
   */
  calcularPromedioPorVenta(): number {
    if (this.ventas.length === 0) return 0;
    return this.calcularTotalVendido() / this.ventas.length;
  }

  /**
   * Calcula el total de productos vendidos
   */
  calcularTotalProductos(): number {
    return this.ventas.reduce((sum, venta) => sum + venta.cantidadProductos, 0);
  }

  /**
   * Formatea la fecha para visualización
   */
  formatearFecha(fecha: Date): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
