import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { TableComponent } from '../../../ui/table/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableComponent, FormsModule, MatIconModule],
  templateUrl: './orders-list.html',
  styleUrls: ['./orders-list.css']
})
export class OrdersList implements OnInit {
  allOrdersData: any[] = [];
  tableData: any[] = [];
  tableColumns: any[] = [];
  
  searchQuery = '';
  
  // Dashboard Counts
  activeCount = 0;
  pendingCount = 0;
  completedCount = 0;
  preparedCount = 0;
  declinedCount = 0;

  constructor(
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }
  
  viewOrder(orderId: string) {
   this.router.navigate(['/orders', orderId]);
  }

  ngOnInit() {
    this.ordersService.getRestaurantOrders().subscribe((orders: any[]) => {
      this.activeCount = 0;
      this.pendingCount = 0;
      this.completedCount = 0;
      this.preparedCount = 0;
      this.declinedCount = 0;

      this.allOrdersData = orders.map((o: any, index: number) => {
        const status = o.status || 'PENDING';
        
        if (status === 'PENDING') this.pendingCount++;
        else if (status === 'COMPLETED') this.completedCount++;
        else if (status === 'PREPARED') this.preparedCount++;
        else if (status === 'DECLINED') this.declinedCount++;
        
        if (status !== 'COMPLETED' && status !== 'DECLINED') this.activeCount++;

        return {
          id: o.id,
          customerName: o.customerName || 'N/A',
          customerPhone: o.customerPhone || 'N/A',
          tableId: o.tableId || '-',
          status: status,
          grandTotal: o.grandTotal || o.cartTotal || 0,
          createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'
        };
      });

      this.tableData = [...this.allOrdersData];

      this.tableColumns = [
        // { key: 'serialNo', label: '#' },
        { key: 'id', label: 'Order ID', type: 'link', routerLink: '/orders' },
        { key: 'customerName', label: 'Customer' },
        { key: 'customerPhone', label: 'Phone' },
        { key: 'tableId', label: 'Table' },
        { key: 'status', label: 'Status' },
        { key: 'grandTotal', label: 'Amount' },
        { key: 'createdAt', label: 'Date' },
        { key: 'actions', label: 'Actions', type: 'actions', actions: [
          { label: 'View', onClick: (row: any) => this.viewOrder(row.id) },
        ] }
      ];

      this.cdr.detectChanges();
    });
  }

  filterOrders() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.tableData = [...this.allOrdersData];
    } else {
      this.tableData = this.allOrdersData.filter(
        (o) => o.customerPhone && String(o.customerPhone).toLowerCase().includes(query)
      );
    }
  }
}
