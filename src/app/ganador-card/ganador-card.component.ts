import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ganador } from '../models/ganador.model';

@Component({
  selector: 'app-ganador-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ganador-card.component.html',
  styleUrl: './ganador-card.component.scss'
})
export class GanadorCardComponent {
  @Input() ganador!: Ganador;
  @Input() lugar!: number;
}
