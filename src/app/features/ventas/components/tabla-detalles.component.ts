import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetalleVenta } from '../../../shared/models';

/**
 * Componente de Tabla Dinámica
 * Muestra los detalles de productos agregados a una venta
 * Permite eliminar productos y calcula automáticamente los subtotales
 */
@Component({
  selector: 'app-tabla-detalles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tabla-container">
      <div *ngIf="detalles.length === 0" class="mensaje-vacio">
        <p>No hay productos agregados. Agrega al menos uno para continuar.</p>
      </div>

      <table *ngIf="detalles.length > 0" class="tabla-detalles">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let detalle of detalles; let i = index" [attr.data-index]="i">
            <td>{{ detalle.nombreProducto }}</td>
            <td class="cantidad">{{ detalle.cantidad }}</td>
            <td class="precio">S/ {{ detalle.precioUnitario.toFixed(2) }}</td>
            <td class="subtotal">S/ {{ detalle.subtotal.toFixed(2) }}</td>
            <td class="acciones">
              <button 
                class="btn-eliminar"
                (click)="eliminarProducto(i)"
                title="Eliminar producto">
                ✕ Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="detalles.length > 0" class="resumen-totales">
        <div class="total-item">
          <span>Cantidad de Productos:</span>
          <strong>{{ cantidadProductos }}</strong>
        </div>
        <div class="total-item total-general">
          <span>Total General:</span>
          <strong>S/ {{ totalGeneral.toFixed(2) }}</strong>
        </div>
      </div>
    </div>
  `,
 styles: [`
    .tabla-container {
      margin-top: 20px;
      padding: 20px;
      background-color: #1e293b; /* Slate oscuro */
      border-radius: 12px;
      border: 1px solid #334155;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }

    .mensaje-vacio {
      text-align: center;
      padding: 40px 20px;
      color: #94a3b8;
      font-style: italic;
    }

    .tabla-detalles {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background-color: #0f172a; /* Fondo interno más oscuro */
      border-radius: 8px;
      overflow: hidden;
    }

    .tabla-detalles thead {
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%); /* Gradiente Azul Cyan tech */
      color: #0f172a; /* Texto oscuro en cabecera para contraste */
    }

    .tabla-detalles th {
      padding: 14px;
      text-align: left;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.05em;
    }

    .tabla-detalles td {
      padding: 14px;
      border-bottom: 1px solid #334155;
      color: #e2e8f0;
    }

    .tabla-detalles tbody tr:hover {
      background-color: rgba(56, 189, 248, 0.05); /* Destello sutil azul */
    }

    .tabla-detalles tbody tr:nth-child(even) {
      background-color: #1e293b;
    }

    .cantidad,
    .precio,
    .subtotal {
      text-align: right;
      font-weight: 500;
    }

    .acciones {
      text-align: center;
    }

    .btn-eliminar {
      background-color: rgba(239, 68, 68, 0.2); /* Rojo traslúcido moderno */
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.4);
      padding: 8px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s ease;
      font-weight: 500;
    }

    .btn-eliminar:hover {
      background-color: #ef4444;
      color: white;
      transform: scale(1.03);
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
    }

    .resumen-totales {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px;
      background: #0f172a;
      border-radius: 8px;
      border: 1px solid #334155;
      border-left: 4px solid #38bdf8;
    }

    .total-item {
      font-size: 16px;
      display: flex;
      gap: 10px;
      align-items: center;
      color: #94a3b8;
    }

    .total-item strong {
      font-size: 18px;
      color: #38bdf8;
    }

    .total-general {
      justify-content: flex-end;
    }

    .total-general strong {
      font-size: 24px;
      color: #38bdf8;
      text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
    }
  `]
  })
export class TabladetallesComponent implements OnChanges {
  @Input() detalles: DetalleVenta[] = [];
  @Output() productoEliminado = new EventEmitter<number>();

  totalGeneral = 0;
  cantidadProductos = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['detalles']) {
      this.calcularTotales();
    }
  }

  /**
   * Calcula automáticamente los totales
   */
  private calcularTotales(): void {
    this.totalGeneral = this.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
    this.cantidadProductos = this.detalles.length;
  }

  /**
   * Elimina un producto de la lista de detalles
   */
  eliminarProducto(index: number): void {
    this.productoEliminado.emit(index);
  }
}
