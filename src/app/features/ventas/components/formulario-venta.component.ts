import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZone } from '@angular/core';
import { VentasService } from '../../../core/services/ventas.service';
import { Cliente, Producto, Venta, DetalleVenta } from '../../../shared/models';
import { TabladetallesComponent } from './tabla-detalles.component';

/**
 * Componente de Formulario de Venta
 * Permite registrar una nueva venta con cliente, productos y cantidades
 */
@Component({
  selector: 'app-formulario-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, TabladetallesComponent],
  template: `
    <div class="formulario-container">
      <h2> Registrar Nueva Venta</h2>

      <!-- Alertas -->
      <div *ngIf="mensajeError" class="alerta alerta-error">
        <strong>❌ Error:</strong> {{ mensajeError }}
        <button (click)="limpiarMensajes()" class="btn-cerrar">✕</button>
      </div>

      <div *ngIf="mensajeExito" class="alerta alerta-exito">
        <strong>✅ Éxito:</strong> {{ mensajeExito }}
        <button (click)="limpiarMensajes()" class="btn-cerrar">✕</button>
      </div>

      <form (ngSubmit)="onSubmit()" class="formulario">
        <!-- Sección 1: Selección de Cliente -->
        <div class="seccion">
          <h3>1. Selecciona un Cliente</h3>
          <div class="form-group">
            <label for="cliente">Cliente *</label>
            <select 
              id="cliente"
              [(ngModel)]="clienteSeleccionado"
              name="cliente"
              required
              [disabled]="cargando">
              <option value="">-- Selecciona un cliente --</option>
              <option *ngFor="let cliente of clientes" [ngValue]="cliente">
                {{ cliente.nombre }} ({{ cliente.rucDni }})
              </option>
            </select>
            <small *ngIf="clienteSeleccionado" class="info">
              Seleccionado: {{ clienteSeleccionado.nombre }}
            </small>
          </div>
        </div>

        <!-- Sección 2: Agregar Productos -->
        <div class="seccion">
          <h3>2. Agrega Productos</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="producto">Producto *</label>
              <select 
                id="producto"
                [(ngModel)]="productoSeleccionado"
                name="producto"
                [disabled]="cargando">
                <option value="">-- Selecciona un producto --</option>
                <option *ngFor="let producto of productos" [ngValue]="producto">
                  {{ producto.nombre }} - S/ {{ producto.precio.toFixed(2) }} (Stock: {{ producto.stock }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="cantidad">Cantidad *</label>
              <input 
                id="cantidad"
                type="number"
                [(ngModel)]="cantidadSeleccionada"
                name="cantidad"
                min="1"
                placeholder="1"
                [disabled]="cargando"
                [max]="productoSeleccionado?.stock || 0">
              <small *ngIf="productoSeleccionado" class="info">
                Stock disponible: {{ productoSeleccionado.stock }}
              </small>
            </div>

            <div class="form-group">
              <label>&nbsp;</label>
              <button 
                type="button"
                (click)="agregarProducto()"
                class="btn-agregar"
                [disabled]="!puedeAgregarProducto()">
                + Agregar
              </button>
            </div>
          </div>
        </div>

        <!-- Sección 3: Tabla de Detalles -->
        <div class="seccion">
          <h3>3. Detalles de la Venta</h3>
          <app-tabla-detalles 
            [detalles]="detallesVenta"
            (productoEliminado)="eliminarProductoDetalle($event)">
          </app-tabla-detalles>
        </div>

        <!-- Sección 4: Acciones -->
        <div class="seccion acciones">
          <button 
            type="submit"
            class="btn-registrar"
            [disabled]="!puedeRegistrar() || cargando">
            {{ cargando ? '⏳ Registrando...' : '💾 Registrar Venta' }}
          </button>
          <button 
            type="button"
            (click)="limpiarFormulario()"
            class="btn-limpiar"
            [disabled]="cargando">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .formulario-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 30px;
      background-color: #1e293b; /* Slate oscuro */
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid #334155;
    }

    h2 {
      color: #f8fafc;
      margin-bottom: 25px;
      border-bottom: 3px solid #38bdf8; /* Línea Cyan tech */
      padding-bottom: 10px;
      font-weight: 700;
    }

    .alerta {
      padding: 15px 20px;
      margin-bottom: 25px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideIn 0.3s ease-in-out;
      border-left: 4px solid transparent;
    }

    .alerta-error {
      background-color: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border-left-color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .alerta-exito {
      background-color: rgba(16, 185, 129, 0.15);
      color: #a7f3d0;
      border-left-color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .btn-cerrar {
      background: none;
      border: none;
      color: inherit;
      font-size: 20px;
      cursor: pointer;
      padding: 0 5px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .btn-cerrar:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .formulario {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .seccion {
      padding: 25px;
      background-color: #0f172a; /* Fondo interno más oscuro */
      border-radius: 12px;
      border: 1px solid #334155;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .seccion h3 {
      color: #38bdf8; /* Títulos de sección en Cyan */
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-group:last-child {
      margin-bottom: 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr 200px;
      gap: 15px;
      align-items: flex-end;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #94a3b8; /* Gris suave que no cansa la vista */
      font-size: 14px;
    }

    select,
    input[type="number"],
    input[type="text"] { /* Agregué text por si acaso lo usas en el cliente */
      width: 100%;
      padding: 12px;
      border: 2px solid #334155;
      background-color: #1e293b;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      color: #f8fafc;
      transition: all 0.2s ease-in-out;
    }

    select:focus,
    input[type="number"]:focus,
    input[type="text"]:focus {
      outline: none;
      border-color: #38bdf8; /* Foco Cyan vibrante */
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
      background-color: #0f172a;
    }

    select:disabled,
    input[type="number"]:disabled,
    input[type="text"]:disabled {
      background-color: #334155;
      cursor: not-allowed;
      color: #64748b;
      border-color: #1e293b;
    }

    .info {
      display: block;
      margin-top: 6px;
      color: #64748b;
      font-size: 12px;
      font-style: italic;
    }

    .btn-agregar {
      background-color: #0ea5e9;
      color: #0f172a;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 700;
      transition: all 0.2s ease-in-out;
    }

    .btn-agregar:hover:not(:disabled) {
      background-color: #38bdf8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.4);
    }

    .btn-agregar:disabled {
      background-color: #334155;
      color: #64748b;
      cursor: not-allowed;
    }

    .acciones {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 10px;
    }

    .btn-registrar,
    .btn-limpiar {
      padding: 14px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      flex: 1;
    }

    .btn-registrar {
      background-color: #10b981; /* Verde esmeralda para guardar con éxito */
      color: #0f172a;
    }

    .btn-registrar:hover:not(:disabled) {
      background-color: #34d399;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(52, 211, 153, 0.4);
    }

    .btn-registrar:disabled {
      background-color: #334155;
      color: #64748b;
      cursor: not-allowed;
    }

    .btn-limpiar {
      background-color: rgba(249, 115, 22, 0.15); /* Naranja traslúcido elegante */
      color: #ffedd5;
      border: 1px solid rgba(249, 115, 22, 0.3);
    }

    .btn-limpiar:hover:not(:disabled) {
      background-color: #f97316;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
    }

    .btn-limpiar:disabled {
      background-color: #334155;
      color: #64748b;
      cursor: not-allowed;
      border: none;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .acciones {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class FormularioVentaComponent implements OnInit {
  // Servicios inyectados
  private ventasService = inject(VentasService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);
  
  // Listas de datos
  clientes: Cliente[] = [];
  productos: Producto[] = [];

  // Modelo de formulario
  clienteSeleccionado: Cliente | null = null;
  productoSeleccionado: Producto | null = null;
  cantidadSeleccionada: number = 1;

  // Detalles de venta
  detallesVenta: DetalleVenta[] = [];

  // Estados
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  /**
   * Carga clientes y productos desde el servicio
   */
  private cargarDatos(): void {
    this.cargando = true;
    console.log('🔄 Cargando datos...');

    Promise.all([
      this.ventasService.getClientes(),
      this.ventasService.getProductos()
    ]).then(([clientes, productos]) => {
      console.log('✅ Datos cargados:', { clientesCount: clientes.length, productosCount: productos.length });
      this.ngZone.run(() => {
        this.clientes = clientes;
        this.productos = productos;
        this.cargando = false;
        this.cdr.markForCheck();
      });
    }).catch((error) => {
      console.error('❌ Error al cargar:', error);
      this.ngZone.run(() => {
        this.mensajeError = 'Error al cargar datos: ' + error.message;
        this.cargando = false;
        this.cdr.markForCheck();
      });
    });
  }

  /**
   * Valida si se puede agregar un producto
   */
  puedeAgregarProducto(): boolean {
    if (!this.productoSeleccionado || this.cantidadSeleccionada <= 0) {
      return false;
    }
    if (this.cantidadSeleccionada > this.productoSeleccionado.stock) {
      return false;
    }
    // Evitar duplicados
    const existe = this.detallesVenta.some(d => d.productoId === this.productoSeleccionado!.id);
    return !existe;
  }

  /**
   * Agrega un producto a la tabla de detalles
   */
  agregarProducto(): void {
    if (!this.puedeAgregarProducto()) {
      this.mensajeError = 'Por favor, valida los datos del producto';
      return;
    }

    const subtotal = this.productoSeleccionado!.precio * this.cantidadSeleccionada;

    const detalle: DetalleVenta = {
      productoId: this.productoSeleccionado!.id,
      nombreProducto: this.productoSeleccionado!.nombre,
      cantidad: this.cantidadSeleccionada,
      precioUnitario: this.productoSeleccionado!.precio,
      subtotal: subtotal
    };

    this.detallesVenta = [...this.detallesVenta, detalle];
    this.limpiarSeleccionProducto();
    this.mensajeError = '';
  }

  /**
   * Elimina un producto de la tabla de detalles
   */
  eliminarProductoDetalle(index: number): void {
    this.detallesVenta = this.detallesVenta.filter((_, i) => i !== index);
  }

  /**
   * Valida si se puede registrar la venta
   */
  puedeRegistrar(): boolean {
    return this.clienteSeleccionado !== null && this.detallesVenta.length > 0;
  }

  /**
   * Calcula el total general de la venta
   */
  private calcularTotalGeneral(): number {
    return this.detallesVenta.reduce((sum, detalle) => sum + detalle.subtotal, 0);
  }

  /**
   * Registra la venta
   */
  onSubmit(): void {
    if (!this.puedeRegistrar()) {
      this.mensajeError = 'Por favor, completa todos los campos requeridos';
      return;
    }

    const venta: Venta = {
      id: 0, // Será asignado por el servicio
      clienteId: this.clienteSeleccionado!.id,
      nombreCliente: this.clienteSeleccionado!.nombre,
      fecha: new Date(),
      detalles: this.detallesVenta,
      totalGeneral: this.calcularTotalGeneral(),
      cantidadProductos: this.detallesVenta.length,
      estado: 'completada'
    };

    this.cargando = true;

    this.ventasService.registrarVenta(venta)
      .then((ventaRegistrada) => {
        this.mensajeExito = `✅ Venta registrada exitosamente (ID: ${ventaRegistrada.id})`;
        this.limpiarFormulario();
        this.cargando = false;
        // Disparar evento para actualizar el listado (si es necesario)
        window.dispatchEvent(new CustomEvent('ventaRegistrada', { detail: ventaRegistrada }));
      })
      .catch((error) => {
        this.mensajeError = error.message || 'Error al registrar la venta';
        this.cargando = false;
      });
  }

  /**
   * Limpia la selección de producto
   */
  private limpiarSeleccionProducto(): void {
    this.productoSeleccionado = null;
    this.cantidadSeleccionada = 1;
  }

  /**
   * Limpia completamente el formulario
   */
  limpiarFormulario(): void {
    this.clienteSeleccionado = null;
    this.limpiarSeleccionProducto();
    this.detallesVenta = [];
    this.mensajeError = '';
  }

  /**
   * Limpia los mensajes de alerta
   */
  limpiarMensajes(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
  }
}
