import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // Added OnInit
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Tableservice, TableData } from '../../../../services/table.service';

@Component({
  selector: 'app-tabledetail',
  standalone: true, // Ensure this is present if using imports directly
  imports: [MatIconModule, CommonModule],
  templateUrl: './tabledetail.html',
  styleUrls: ['./tabledetail.css'],
})
export class Tabledetail implements OnInit {
  // This will hold the actual data from your API
  tables: TableData[] = [];
  isLoading: boolean = true;

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

  addTable() {
    const input = prompt("Enter the Table Number (e.g. 1, 2, 5):");
    if (!input) return; // User cancelled

    const tableNo = parseInt(input, 10);
    if (isNaN(tableNo) || tableNo < 0) {
      alert("Invalid Table Number. Please enter a valid number.");
      return;
    }

    this.isLoading = true;
    this.tableservice.createTable(tableNo).subscribe({
      next: () => {
        console.log('Table created successfully');
        this.fetchTables(); // Refresh list after creation
      },
      error: (err) => {
        console.error('Error creating table:', err);
        alert('Failed to create table.');
        this.isLoading = false; // Reset loading if it failed
        this.cdr.detectChanges();
      }
    });
  }
}