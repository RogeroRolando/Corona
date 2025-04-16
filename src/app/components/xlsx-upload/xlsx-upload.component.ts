import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-xlsx-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './xlsx-upload.component.html',
  styleUrls: ['./xlsx-upload.component.css']
})
export class XlsxUploadComponent {
  @Output() archivoCargado = new EventEmitter<File>();
  fileName: string = '';

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.archivoCargado.emit(file);
      this.fileName = file.name;
    }
  }
}

