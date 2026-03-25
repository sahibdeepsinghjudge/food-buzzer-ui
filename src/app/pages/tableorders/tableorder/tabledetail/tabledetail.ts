import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tableservice, TableData } from '../../../../services/table.service';

@Component({
  selector: 'app-tabledetail',
  standalone: true, 
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './tabledetail.html',
  styleUrls: ['./tabledetail.css'],
})
export class Tabledetail implements OnInit {
  tables: TableData[] = [];
  isLoading: boolean = true;
  showAddTableModal: boolean = false;
  newTableNo: number | null = null;

  constructor(private tableservice: Tableservice, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchTables();
  }

  fetchTables() {
    this.isLoading = true;
    this.tableservice.getTableStatus().subscribe({
      next: (res: any) => {
        // Handle cases where the backend returns the array directly or wrapped in `data`
        const fetchedData = res.data || res;
        this.tables = Array.isArray(fetchedData) ? fetchedData : [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching tables:', err);
        this.tables = [];
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  openAddTableModal() {
    this.newTableNo = null;
    this.showAddTableModal = true;
  }

  closeAddTableModal() {
    this.showAddTableModal = false;
  }

  confirmAddTable() {
    if (this.newTableNo === null || this.newTableNo < 0) {
      alert("Invalid Table Number. Please enter a valid number.");
      return;
    }

    this.isLoading = true;
    this.showAddTableModal = false;
    this.tableservice.createTable(this.newTableNo).subscribe({
      next: () => {
        console.log('Table created successfully');
        this.fetchTables(); // Refresh list after creation
      },
      error: (err) => {
        console.error('Error creating table:', err);
        alert('Failed to create table. Please ensure the table number does not exist.');
        this.isLoading = false; 
        this.cdr.detectChanges();
      }
    });
  }
}