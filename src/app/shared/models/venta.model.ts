import { DetalleVenta } from './detalle-venta.model';

/**
 * Modelo de Venta
 * Representa una transacción completa de venta
 */
export interface Venta {
  id: number;
  clienteId: number;
  nombreCliente: string;
  fecha: Date;
  detalles: DetalleVenta[];
  totalGeneral: number;
  cantidadProductos: number;
  estado?: string; // 'completada', 'pendiente', etc.
}
