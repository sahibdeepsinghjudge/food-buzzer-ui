import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-pendingorders',
  imports: [Kdsscreen, CommonModule, RouterModule],
  templateUrl: './pendingorders.html',
  styleUrl: './pendingorders.css',
})
export class Pendingorders {
  orderedData: any[] = [];
  orderLength: number = 0;
  constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getRestaurantOrders(['PENDING']).subscribe(orders => {
      this.orderedData = orders;
      this.orderLength = this.orderedData.length;
      this.cdr.detectChanges();
    });
  }

  activeDropDown: number|null = null;
  toggleDropDown(orderId: number) {
    this.activeDropDown = this.activeDropDown === orderId ? null : orderId;
  }

  updateStatus(orderId: number, status: string) {
    this.ordersService.updateOrderStatus(orderId, status).subscribe({
      next: () => { this.loadOrders(); },
      error: (err) => { console.error('Failed:', err); }
    });
    this.activeDropDown = null;
  }

  printPage() {}
}