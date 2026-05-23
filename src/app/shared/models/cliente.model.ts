/**
 * Modelo de Cliente
 * Representa a un cliente con información básica de identificación
 */
export interface Cliente {
  id: number;
  nombre: string;
  rucDni: string;
  email?: string;
  telefono?: string;
}
