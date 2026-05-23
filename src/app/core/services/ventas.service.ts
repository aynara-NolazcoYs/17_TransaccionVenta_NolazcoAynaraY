import { Injectable } from '@angular/core';
import { Cliente, Producto, Venta, DetalleVenta } from '../../shared/models';

/**
 * Servicio de Ventas con datos en memoria
 * Simula una API REST con promesas y delays asincronos
 */
@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private readonly DELAY = 500; // Simula latencia de red en milisegundos

  // Datos en memoria - Clientes
  private clientes: Cliente[] = [
    {
      id: 1,
      nombre: 'Dr. Fernando Morales',
      rucDni: '10987654',
      email: 'fernando.morales@health.com',
      telefono: '952111222'
    },
    {
      id: 2,
      nombre: 'Dra. Catalina Ramírez',
      rucDni: '20876543',
      email: 'catalina.ramirez@clinic.com',
      telefono: '952333444'
    },
    {
      id: 3,
      nombre: 'Centro Médico La Salud',
      rucDni: '31112233',
      email: 'contacto@saludclinic.com',
      telefono: '952555666'
    },
    {
      id: 4,
      nombre: 'Farmacia Cruz Azul',
      rucDni: '42334455',
      email: 'admin@cruazul.pe',
      telefono: '952777888'
    },
    {
      id: 5,
      nombre: 'Lic. Patricia Gómez',
      rucDni: '53445566',
      email: 'patricia.gomez@wellness.com',
      telefono: '952888999'
    }
  ];

  // Datos en memoria - Productos
  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'Vitamina C 1000mg',
      precio: 45.50,
      stock: 150,
      descripcion: 'Suplemento vitamínico - 30 cápsulas',
      categoria: 'Vitaminas'
    },
    {
      id: 2,
      nombre: 'Omega 3 Concentrado',
      precio: 89.99,
      stock: 85,
      descripcion: 'Ácidos grasos esenciales - 60 cápsulas',
      categoria: 'Suplementos'
    },
    {
      id: 3,
      nombre: 'Probióticos Premium',
      precio: 72.50,
      stock: 110,
      descripcion: 'Flora intestinal - 30 dosis',
      categoria: 'Probióticos'
    },
    {
      id: 4,
      nombre: 'Glucosamina + Condroitina',
      precio: 95.99,
      stock: 60,
      descripcion: 'Salud articular - 90 cápsulas',
      categoria: 'Articulaciones'
    },
    {
      id: 5,
      nombre: 'Coenzima Q10',
      precio: 125.00,
      stock: 45,
      descripcion: 'Energía celular - 60 cápsulas',
      categoria: 'Coenzimas'
    },
    {
      id: 6,
      nombre: 'Melatonina Natural',
      precio: 38.99,
      stock: 200,
      descripcion: 'Sueño reparador - 30 tabletas',
      categoria: 'Sueño'
    },
    {
      id: 7,
      nombre: 'Magnesio Quelado',
      precio: 52.50,
      stock: 130,
      descripcion: 'Minerales y relajación - 100 cápsulas',
      categoria: 'Minerales'
    },
    {
      id: 8,
      nombre: 'Colágeno Marino Hidrolizado',
      precio: 65.00,
      stock: 95,
      descripcion: 'Piel y articulaciones - 300g polvo',
      categoria: 'Belleza'
    }
  ];

  // Datos en memoria - Ventas realizadas
  private ventas: Venta[] = [];

  // Contador de IDs para ventas
  private ventaIdCounter = 1;

  constructor() {}

  /**
   * Obtiene la lista de clientes disponibles
   * Simula una petición GET asincrónica
   */
  getClientes(): Promise<Cliente[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.clientes]); // Retorna una copia para evitar mutaciones
      }, this.DELAY);
    });
  }

  /**
   * Obtiene la lista de productos disponibles
   * Simula una petición GET asincrónica
   */
  getProductos(): Promise<Producto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.productos]); // Retorna una copia con stock actualizado
      }, this.DELAY);
    });
  }

  /**
   * Registra una nueva venta en memoria
   * Simula una petición POST asincrónica
   * Valida el stock y actualiza el inventario
   */
  registrarVenta(venta: Venta): Promise<Venta> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validar que hay detalles
        if (!venta.detalles || venta.detalles.length === 0) {
          reject(new Error('La venta debe tener al menos un producto'));
          return;
        }

        // Validar stock disponible
        for (const detalle of venta.detalles) {
          const producto = this.productos.find(p => p.id === detalle.productoId);
          if (!producto) {
            reject(new Error(`Producto con ID ${detalle.productoId} no encontrado`));
            return;
          }
          if (producto.stock < detalle.cantidad) {
            reject(new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`));
            return;
          }
        }

        // Actualizar stock de productos
        for (const detalle of venta.detalles) {
          const producto = this.productos.find(p => p.id === detalle.productoId);
          if (producto) {
            producto.stock -= detalle.cantidad;
          }
        }

        // Crear venta con ID
        const nuevaVenta: Venta = {
          ...venta,
          id: this.ventaIdCounter++,
          fecha: new Date(),
          estado: 'completada'
        };

        // Guardar venta
        this.ventas.push(nuevaVenta);

        resolve(nuevaVenta);
      }, this.DELAY);
    });
  }

  /**
   * Obtiene la lista de todas las ventas realizadas
   * Simula una petición GET asincrónica
   */
  getVentas(): Promise<Venta[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Ordena las ventas por fecha descendente (más recientes primero)
        const ventasOrdenadas = [...this.ventas].sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
        resolve(ventasOrdenadas);
      }, this.DELAY);
    });
  }

  /**
   * Obtiene una venta específica por ID
   */
  getVentaById(id: number): Promise<Venta | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const venta = this.ventas.find(v => v.id === id);
        resolve(venta);
      }, this.DELAY);
    });
  }

  /**
   * Obtiene un cliente específico por ID
   */
  getClienteById(id: number): Promise<Cliente | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cliente = this.clientes.find(c => c.id === id);
        resolve(cliente);
      }, this.DELAY);
    });
  }

  /**
   * Obtiene un producto específico por ID
   */
  getProductoById(id: number): Promise<Producto | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const producto = this.productos.find(p => p.id === id);
        resolve(producto ? { ...producto } : undefined); // Retorna copia o undefined
      }, this.DELAY);
    });
  }
}
