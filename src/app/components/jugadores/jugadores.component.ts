import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GoogleSheetsService } from '../../services/google-sheets.service';

@Component({
  selector: 'app-jugadores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <h2>Jugadores</h2>
    <ul>
      <li *ngFor="let j of service.jugadores()">
        {{ j.Nombre }} ({{ j.RangoInicio }} - {{ j.RangoFin }})
      </li>
    </ul>
    <a routerLink="/ventas">👉 Registrar nueva venta</a>
  \`
})
export class JugadoresComponent {
  service = inject(GoogleSheetsService);
  constructor() {
    this.service.loadJugadores();
  }
}