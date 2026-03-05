import { Component, Input } from '@angular/core';
import { DataTiles } from '../data-tiles/data-tiles';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tiles-container',
  imports: [DataTiles,CommonModule],
  templateUrl: './tiles-container.html',
  styleUrl: './tiles-container.css',
})
export class TilesContainer {
  @Input() dataTiles: any[] = [];
}
