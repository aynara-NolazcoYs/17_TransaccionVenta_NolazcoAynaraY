import { Component } from '@angular/core';

/**
 * Componente Root de la Aplicación
 * Punto de entrada principal de la aplicación de ventas
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Sistema de Transacción de Venta';
}

