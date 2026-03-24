import { Component, OnInit } from '@angular/core'; // Added OnInit
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Tableservice, TableData } from '../../../../services/tableservice';

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

  constructor(private tableservice: Tableservice) {}

  ngOnInit() {
    this.fetchTables();
  }

  fetchTables() {
    this.tableservice.getTableStatus().subscribe({
      next: (data: TableData[]) => {
        this.tables = data;
        this.isLoading = false;
        console.log('Tables loaded:', this.tables);
      },
      error: (err) => {
        console.error('Error fetching tables:', err);
        this.isLoading = false;
      }
    });
  }

  addTable() {
    alert('Add Table Clicked!');
  }
}