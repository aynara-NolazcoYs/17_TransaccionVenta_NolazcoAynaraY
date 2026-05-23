import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';
import { VentasService } from './core/services/ventas.service';
import { VentasPageComponent } from './features/ventas/pages/ventas-page.component';

/**
 * Módulo Principal de la Aplicación
 * Configura los módulos globales y las rutas principales
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    VentasPageComponent
  ],
  providers: [VentasService],
  bootstrap: [AppComponent]
})
export class AppModule { }
