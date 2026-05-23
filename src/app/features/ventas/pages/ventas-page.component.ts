import { Component } from '@angular/core';
import { FormularioVentaComponent } from '../components/formulario-venta.component';
import { ListadoVentasComponent } from '../components/listado-ventas.component';

/**
 * Página Principal de Ventas
 * Contenedor que integra el formulario de venta y el listado de ventas
 */
@Component({
  selector: 'app-ventas-page',
  standalone: true,
  imports: [FormularioVentaComponent, ListadoVentasComponent],
  template: `
    <div class="ventas-page">
      <div class="contenedor">
        <header class="header">
          <h1> Sistema de Transacción de Venta</h1>
          <p class="subtitulo">Gestiona tus ventas</p>
        </header>

        <div class="grid-container">
          <section class="seccion-formulario">
            <app-formulario-venta></app-formulario-venta>
          </section>

          <section class="seccion-listado">
            <app-listado-ventas></app-listado-ventas>
          </section>
        </div>

        <footer class="footer">
          <p>© 2026 Sistema de Ventas</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .ventas-page {
      /* Fondo degradado oscuro premium */
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      min-height: 100vh;
      padding: 30px 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .contenedor {
      max-width: 1280px; /* Un poco más amplio para el despliegue del grid */
      margin: 0 auto;
    }

    .header {
      text-align: center;
      color: #f8fafc;
      margin-bottom: 40px;
      animation: slideDown 0.5s ease-in-out;
    }

    .header h1 {
      font-size: 36px;
      margin: 0 0 10px 0;
      font-weight: 800;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
    }

    .subtitulo {
      font-size: 16px;
      margin: 0;
      color: #94a3b8; /* Gris suave para mejor contraste secundario */
      font-weight: 400;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 25px; /* Espaciado moderno entre paneles */
      margin-bottom: 40px;
      animation: fadeIn 0.6s ease-in-out 0.2s both;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Removidos fondos e hilos verdes para que hereden el diseño oscuro de los hijos */
    .seccion-formulario,
    .seccion-listado {
      background-color: transparent; 
      border-radius: 12px;
      overflow: hidden;
    }

    .footer {
      text-align: center;
      color: #64748b;
      padding: 20px;
      font-size: 14px;
      border-top: 1px solid #334155;
      margin-top: 20px;
    }

    .footer p {
      margin: 0;
    }

    @media (max-width: 1100px) {
      /* Pasa a una sola columna un poco antes para que las tablas no se aprieten */
      .grid-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }

    @media (max-width: 768px) {
      .ventas-page {
        padding: 15px 10px;
      }

      .header h1 {
        font-size: 24px;
      }

      .header {
        margin-bottom: 25px;
      }
    }
  `]
})
export class VentasPageComponent {}