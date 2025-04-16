import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'https://script.google.com/macros/s/AKfycbxlPhC0nJ1noOHzhuKwWrY_9NdGTOgdeTwQ1yCFyT12nS5RIweMNhNavEiPUi-Qm7Gvhw/exec';

@Injectable({ providedIn: 'root' })
export class GoogleSheetsService {
  jugadores = signal<any[]>([]);
  ventas = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  loadJugadores() {
    this.http.get<any[]>(`${API_URL}?action=getJugadores`)
      .subscribe(res => this.jugadores.set(res));
  }

  loadVentas() {
    this.http.get<any[]>(`${API_URL}?action=getVentas`)
      .subscribe(res => this.ventas.set(res));
  }

  addVenta(data: any) {
    return this.http.post(API_URL, {
      action: 'addVenta',
      payload: data
    });
  }
}