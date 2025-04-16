import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XlsxLoaderService } from '../services/xlsx-loader.service';
import { GanadorCardComponent } from '../ganador-card/ganador-card.component';
import { XlsxUploadComponent } from '../components/xlsx-upload/xlsx-upload.component';
import { Ganador } from '../models/ganador.model';

@Component({
  selector: 'app-sorteo',
  standalone: true,
  imports: [CommonModule, GanadorCardComponent, XlsxUploadComponent],
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css']
})
export class SorteoComponent {
  numerosVendidos = signal<{numero: number, vendedor: string}[]>([]);
  ganadores = signal<Ganador[]>([]);
  sorteando = signal<boolean>(false);
  archivoCargado = signal<boolean>(false);
  premios = [
    'Huevo Relleno 20cm',
    'Huevo Relleno 15cm',
    'Huevo Relleno 15cm'
  ];
  paginaActual = signal<number>(1);
  tamanioPagina = 20;

  constructor(private xlsx: XlsxLoaderService) {
    effect(() => {
      const ventas = this.xlsx.datos();
      console.log('Ventas cargadas:', ventas);
      this.numerosVendidos.set(ventas);
      console.log('Números vendidos generados:', ventas);
      this.paginaActual.set(1); // reset al cargar archivo
    });
  }

  get hayNumerosVendidos() {
    return this.numerosVendidos().length > 0;
  }

  get totalPaginas() {
    return Math.ceil(this.numerosVendidos().length / this.tamanioPagina) || 1;
  }

  get previewPaginaActual() {
    const start = (this.paginaActual() - 1) * this.tamanioPagina;
    return this.numerosVendidos().slice(start, start + this.tamanioPagina);
  }

  irPaginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.set(this.paginaActual() - 1);
  }

  irPaginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas) this.paginaActual.set(this.paginaActual() + 1);
  }

  irPagina(p: number) {
    if (p >= 1 && p <= this.totalPaginas) this.paginaActual.set(p);
  }

  onArchivoCargado(file: File) {
    this.xlsx.cargarArchivo(file);
    this.archivoCargado.set(true);
  }


  sortear() {
    console.log('Números vendidos al sortear:', this.numerosVendidos());
    this.sorteando.set(true);
    setTimeout(() => {
      const numeros = [...this.numerosVendidos()];
      const ganadores: Ganador[] = [];
      const usados = new Set<number>();
      while (ganadores.length < 3 && numeros.length > 0) {
        const idx = Math.floor(Math.random() * numeros.length);
        const ganador = numeros[idx];
        if (!usados.has(ganador.numero)) {
          ganadores.push({
            numero: ganador.numero,
            nombre: ganador.vendedor,
            vendedor: ganador.vendedor,
            premio: this.premios[ganadores.length]
          });
          usados.add(ganador.numero);
        }
        numeros.splice(idx, 1);
      }
      console.log('Ganadores sorteados:', ganadores);
      this.ganadores.set(ganadores);
      this.sorteando.set(false);
    }, 3000); // Simula animación de 3 segundos
  }
}
