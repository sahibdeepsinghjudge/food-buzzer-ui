import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


export interface DataTile {
  label: string;
  number: string;
  comparison_number_percentage?: number | null;
  comparison_parameter?: string | null;
}


@Component({
  selector: 'app-data-tiles',
  imports: [CommonModule],
  templateUrl: './data-tiles.html',
  styleUrl: './data-tiles.css',
})
export class DataTiles implements DataTile {
  @Input() number: string = '';
  @Input() label: string = '';
  @Input() comparison_number_percentage: number | null | undefined = null;
  @Input() comparison_parameter: string | null | undefined = null;
  
  get isPositive() {
    if(this.comparison_number_percentage == null || this.comparison_parameter == null) {
      return null;
    }
    return this.comparison_number_percentage > 0;
  }

}
