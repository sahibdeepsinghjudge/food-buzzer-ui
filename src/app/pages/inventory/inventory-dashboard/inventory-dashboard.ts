import { Component, signal } from '@angular/core';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { DataTile } from '../../../ui/data-tiles/data-tiles';
import { InventoryService, RawMaterial } from '../inventory-service';
import { TableColumn, TableComponent } from '../../../ui/table/table';
import { Button } from '../../../ui/button/button';

@Component({
  selector: 'app-inventory-dashboard',
  imports: [TilesContainer,TableComponent,Button],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css',
})
export class InventoryDashboard {

  constructor(private inventoryService: InventoryService) { }
  tableData = signal<RawMaterial[]>([]);
  dataTiles = signal<DataTile[]>([]); 
  ngOnInit() {
    this.inventoryService.getInventoryStats().subscribe(stats => {
      this.dataTiles.set(stats);
    });
    this.inventoryService.getRawMaterials().subscribe(materials => {
      this.tableData.set(materials);
    });
  }

  getFilteredMaterials(filter:string) {
    this.inventoryService.getFilteredMaterials(filter).subscribe(materials => {
      this.tableData.set(materials);
    });
  }

  columns: TableColumn[] = [
    {key: 'id', label: 'ID',type: 'link', routerLink: '/inventory/product'},
    { key: 'name', label: 'Product Name'  },
    { key: 'unit', label: 'Unit' },
    { key: 'current_stock', label: 'Current Stock' },
    { key: 'reorder_level', label: 'Reorder Level' },
    { key: 'cost_per_unit', label: 'Cost Per Unit (Rs.)' },
    // { key: 'is_active', label: 'Active' },
  ];

   
}
