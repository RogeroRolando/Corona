import { Injectable, signal } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class XlsxLoaderService {
  datos = signal<{numero: number, vendedor: string}[]>([]);

  cargarArchivo(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // Extraer rango B3:P24 y asociar vendedor
      const range = XLSX.utils.decode_range('B3:P24');
      const vendidos: {numero: number, vendedor: string}[] = [];
      for (let row = range.s.r; row <= range.e.r; row++) {
        // El vendedor está en la columna A (col 0), misma fila
        const vendedorCellRef = XLSX.utils.encode_cell({ c: 0, r: row });
        const vendedorCell = worksheet[vendedorCellRef];
        const vendedor = vendedorCell ? vendedorCell.v : '';
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = { c: col, r: row };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = worksheet[cellRef];
          const value = cell ? cell.v : '';
          if (value && !isNaN(+value)) {
            vendidos.push({ numero: +value, vendedor });
          }
        }
      }
      this.datos.set(vendidos);
    };
    reader.readAsArrayBuffer(file);
  }
}
