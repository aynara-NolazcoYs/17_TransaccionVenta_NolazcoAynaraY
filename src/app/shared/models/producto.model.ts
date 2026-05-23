/**
 * Modelo de Producto
 * Representa un producto disponible en el sistema con inventario
 */
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion?: string;
  categoria?: string;
}
