import { Component, signal } from '@angular/core';
import { TilesContainer } from '../../../ui/tiles-container/tiles-container';
import { DataTile } from '../../../ui/data-tiles/data-tiles';
import { InventoryService, RawMaterial } from '../inventory-service';
import { TableColumn, TableComponent, TableAction } from '../../../ui/table/table';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [TilesContainer,TableComponent,Button,MatIconModule],
  templateUrl: './inventory-dashboard.html',
  styleUrl: './inventory-dashboard.css',
})
export class InventoryDashboard {

  constructor(private inventoryService: InventoryService, private router: Router) { }
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
    if (filter === 'all') {
      this.inventoryService.getRawMaterials().subscribe(materials => this.tableData.set(materials));
      return;
    }
    this.inventoryService.getFilteredMaterials(filter).subscribe(materials => {
      this.tableData.set(materials);
    });
  }

  onSearch(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query && query.trim() !== '') {
      this.inventoryService.searchMaterials(query.trim()).subscribe(materials => {
        this.tableData.set(materials);
      });
    } else {
      // If empty, reset to all materials
      this.getFilteredMaterials('all');
    }
  }

  columns: TableColumn[] = [
    { key: 'id', label: 'ID', type: 'link', routerLink: '/inventory/product' },
    { key: 'name', label: 'Product Name' },
    { key: 'unit', label: 'Unit' },
    { key: 'currentStock', label: 'Current Stock' },
    { key: 'reorderLevel', label: 'Reorder Level' },
    { key: 'costPerUnit', label: 'Cost Per Unit (Rs.)' },
    { 
      key: 'actions', 
      label: 'Actions', 
      type: 'actions', 
      actions: [
        {
          label: 'View / Edit',
          variant: 'secondary',
          onClick: (row: RawMaterial) => this.router.navigate(['/inventory/product', row.id])
        },
        {
          label: 'Delete',
          variant: 'danger',
          onClick: (row: RawMaterial) => this.deleteMaterial(row)
        }
      ]
    }
  ];

  deleteMaterial(row: RawMaterial) {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      this.inventoryService.deleteMaterial(row.id).subscribe({
        next: () => {
          // Refresh the table data
          this.inventoryService.getRawMaterials().subscribe(materials => {
             this.tableData.set(materials);
          });
        },
        error: (err) => console.error('Failed to delete', err)
      });
    }
  }

   
}
