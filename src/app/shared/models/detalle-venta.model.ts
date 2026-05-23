/**
 * Modelo de DetalleVenta
 * Representa un línea de detalle dentro de una venta
 */
export interface DetalleVenta {
  id?: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
