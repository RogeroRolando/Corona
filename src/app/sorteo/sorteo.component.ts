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
    'Primer Premio',
    'Segundo Premio',
    'Tercer Premio'
  ];
  paginaActual = signal<number>(1);
  tamanioPagina = 20;
  // Números especiales para el primer premio con clic derecho
  numerosEspecialesPrimerPremio = [108, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150];

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


  sortear(usarNumerosEspeciales: boolean = false) {
    console.log('Números vendidos al sortear:', this.numerosVendidos());
    console.log('Usar números especiales para primer premio:', usarNumerosEspeciales);
    this.sorteando.set(true);
    setTimeout(() => {
      const numeros = [...this.numerosVendidos()];
      const ganadores: Ganador[] = [];
      const usados = new Set<number>();
      
      // Si es clic derecho, sortear el primer premio solo entre números especiales
      if (usarNumerosEspeciales && ganadores.length === 0) {
        // Filtrar solo los números especiales que están en los números vendidos
        const numerosEspecialesDisponibles = numeros.filter(n => 
          this.numerosEspecialesPrimerPremio.includes(n.numero) && !usados.has(n.numero)
        );
        
        if (numerosEspecialesDisponibles.length > 0) {
          const idx = Math.floor(Math.random() * numerosEspecialesDisponibles.length);
          const ganador = numerosEspecialesDisponibles[idx];
          ganadores.push({
            numero: ganador.numero,
            nombre: ganador.vendedor,
            vendedor: ganador.vendedor,
            premio: this.premios[0]
          });
          usados.add(ganador.numero);
          // Remover el ganador de la lista de números disponibles
          const indexToRemove = numeros.findIndex(n => n.numero === ganador.numero);
          if (indexToRemove !== -1) {
            numeros.splice(indexToRemove, 1);
          }
        }
      }
      
      // Sortear los premios restantes (o todos si no se usó clic derecho)
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

  onSortearClickDerecho(event: MouseEvent) {
    event.preventDefault(); // Prevenir el menú contextual del navegador
    if (!this.sorteando() && this.numerosVendidos().length > 0) {
      this.sortear(true);
    }
  }

  // Soporte adicional para touchpads / trackpads:
  // algunos dispositivos envían solo eventos de botón derecho en mousedown
  // y no siempre disparan correctamente el evento contextmenu.
  onSortearMouseDown(event: MouseEvent) {
    // button === 2 => botón derecho
    if (event.button === 2) {
      this.onSortearClickDerecho(event);
    }
  }
}
