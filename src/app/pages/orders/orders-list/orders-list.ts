import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';
import { TableComponent } from '../../../ui/table/table';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableComponent],
  templateUrl: './orders-list.html',
  styleUrls: ['./orders-list.css']
})
export class OrdersList implements OnInit {
  tableData: any[] = [];
  tableColumns: any[] = [];

  constructor(
    private ordersService: OrdersService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ordersService.getRestaurantOrders().subscribe((orders: any[]) => {
      this.tableData = orders.map((o: any, index: number) => ({
        serialNo: index + 1,
        id: o.id,
        customerName: o.customerName || 'N/A',
        customerPhone: o.customerPhone || 'N/A',
        tableId: o.tableId || '-',
        status: o.status || 'PENDING',
        totalAmount: o.finalAmount || o.totalAmount || 0,
        createdAt: o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'
      }));

      this.tableColumns = [
        { key: 'serialNo', label: '#' },
        { key: 'id', label: 'Order ID', type: 'link', routerLink: '/orders' },
        { key: 'customerName', label: 'Customer' },
        { key: 'customerPhone', label: 'Phone' },
        { key: 'tableId', label: 'Table' },
        { key: 'status', label: 'Status' },
        { key: 'totalAmount', label: 'Amount' },
        { key: 'createdAt', label: 'Date' }
      ];

      this.cdr.detectChanges();
    });
  }
}
