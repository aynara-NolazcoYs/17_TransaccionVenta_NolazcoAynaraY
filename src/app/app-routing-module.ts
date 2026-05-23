import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasPageComponent } from './features/ventas/pages/ventas-page.component';

/**
 * Configuración de Rutas de la Aplicación
 * Define todas las rutas disponibles del sistema
 */
const routes: Routes = [
  {
    path: '',
    component: VentasPageComponent
  },
  {
    path: 'ventas',
    component: VentasPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
