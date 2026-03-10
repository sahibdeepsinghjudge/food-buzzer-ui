import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'button' | 'link';
  routerLink?: string;
  onClick?: (row: any) => void;
  buttonText?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './table.html',
  styleUrls: ['./table.css'],
})
export class TableComponent {
  @Input() columns: TableColumn[] = [/*{
    key: 'name',
    label: 'Restaurant Name',
    type: 'link',
    routerLink: '/restaurants'
  },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'status',
    label: 'Status'
  },
  {
    key: 'approve',
    label: 'Actions',
    type: 'button',
    buttonText: 'Approve',
    onClick: (row: any) => {
      console.log(row);
    }
    }*/];
  @Input() restaurantDetails: boolean=false;
  @Input() data: any[] = [/*{
    id: 1,
    name: 'Spice Garden',
    email: 'spice@test.com',
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Pizza House',
    email: 'pizza@test.com',
    status: 'Pending'
  }*/];
  handleClick(column: TableColumn, row: any) {
    if (column.onClick) {
      column.onClick(row);
    }
  }
}