import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleSheetsService } from '../../services/google-sheets.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <h2>Registrar Venta</h2>
    <form (ngSubmit)="registrarVenta()">
      <input type="text" [(ngModel)]="numero" name="numero" placeholder="Número vendido">
      <input type="text" [(ngModel)]="vendedorID" name="vendedorID" placeholder="ID Vendedor">
      <input type="text" [(ngModel)]="cliente" name="cliente" placeholder="Cliente">
      <button type="submit">Guardar</button>
    </form>
  \`
})
export class VentasComponent {
  service = inject(GoogleSheetsService);
  numero = '';
  vendedorID = '';
  cliente = '';

  registrarVenta() {
    const fecha = new Date().toISOString().split('T')[0];
    this.service.addVenta({
      numero: this.numero,
      vendedorID: this.vendedorID,
      cliente: this.cliente,
      fecha
    }).subscribe(() => alert('Venta registrada correctamente'));
  }
}