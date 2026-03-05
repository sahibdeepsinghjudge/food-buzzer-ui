import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-tiles',
  imports: [],
  templateUrl: './data-tiles.html',
  styleUrl: './data-tiles.css',
})
export class DataTiles {
  @Input() number: string = '';
  @Input() label: string = '';
  @Input() comparison_number_percentage: number = 0;
  @Input() comparison_parameter: string = '';
  
  get isPositive() {
    return this.comparison_number_percentage > 0;
  }

}
