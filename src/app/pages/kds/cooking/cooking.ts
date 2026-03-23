import { ChangeDetectorRef, Component } from '@angular/core';
import { Kdsscreen } from '../kdsscreen/kdsscreen';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrdersService } from '../../../services/orders.service';

@Component({
  selector: 'app-cooking',
  imports: [Kdsscreen, CommonModule, RouterModule],
  templateUrl: './cooking.html',
  styleUrl: './cooking.css',
})
export class Cooking {
  orderedData: any[] = [];
  orderLength: number = 0;
  constructor(private ordersService: OrdersService, private cdr: ChangeDetectorRef){}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getRestaurantOrders(['COOKING']).subscribe(orders => {
      this.orderedData = orders;
      this.orderLength = this.orderedData.length;
      this.cdr.detectChanges();
    });
  }

  updateStatus(orderId: number, status: string) {
    this.ordersService.updateOrderStatus(orderId, status).subscribe({
      next: () => { this.loadOrders(); },
      error: (err) => { console.error('Failed:', err); }
    });
  }

  printPage() {}
}